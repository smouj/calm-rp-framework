import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { afterAll, describe, expect, it } from 'vitest';

import { MigrationRunner, PgliteSession } from '@gta6-rp/persistence';

const MIGRATIONS_DIR = resolve(process.cwd(), 'infrastructure/database/migrations');

const opened: PgliteSession[] = [];

async function freshDatabase(): Promise<PgliteSession> {
  const dir = await mkdtemp(join(tmpdir(), 'calm-migrations-'));
  const session = new PgliteSession(new PGlite(dir));
  opened.push(session);
  return session;
}

afterAll(async () => {
  await Promise.all(opened.map((session) => session.close().catch(() => undefined)));
});

describe('migration runner (embedded PostgreSQL)', () => {
  it('applies every pending migration in file order, exactly once', async () => {
    const session = await freshDatabase();
    const runner = new MigrationRunner(session);

    const applied = await runner.applyDirectory(MIGRATIONS_DIR);

    expect(applied.map((migration) => migration.name)).toEqual([
      '0001_bootstrap.sql',
      '0002_sessions_ledger_guards.sql',
    ]);

    const tables = await session.query(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name`,
    );
    expect(tables.rows.map((row) => String(row['table_name']))).toContain('ledger_entries');
    expect(tables.rows.map((row) => String(row['table_name']))).toContain('sessions');
  });

  it('is idempotent: a second run applies nothing and lists what is applied', async () => {
    const session = await freshDatabase();
    const runner = new MigrationRunner(session);
    await runner.applyDirectory(MIGRATIONS_DIR);

    const second = await runner.applyDirectory(MIGRATIONS_DIR);

    expect(second).toEqual([]);
    const recorded = await runner.applied();
    expect(recorded.map((migration) => migration.name)).toHaveLength(2);
  });

  it('never reapplies migrations after a full restart of the database engine', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'calm-restart-'));
    const first = new PgliteSession(new PGlite(dir));
    await new MigrationRunner(first).applyDirectory(MIGRATIONS_DIR);
    await first.close();

    const reopened = new PGlite(dir);
    const second = new PgliteSession(reopened);
    opened.push(second);
    const applied = await new MigrationRunner(second).applyDirectory(MIGRATIONS_DIR);

    expect(applied).toEqual([]);
    const characters = await second.query(
      `SELECT first_name, last_name FROM characters WHERE id = '00000000-0000-4000-8000-0000000000f2'`,
    );
    expect(characters.rows).toEqual([{ first_name: 'CALM Treasury', last_name: 'System' }]);
  });

  it('seeds the reserved treasury account exactly once across restarts', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'calm-treasury-'));
    const first = new PgliteSession(new PGlite(dir));
    await new MigrationRunner(first).applyDirectory(MIGRATIONS_DIR);
    await first.close();

    const reopened = new PgliteSession(new PGlite(dir));
    opened.push(reopened);
    const accounts = await reopened.query('SELECT count(*)::int AS n FROM financial_accounts');

    expect(accounts.rows[0]).toEqual({ n: 1 });
  });
});
