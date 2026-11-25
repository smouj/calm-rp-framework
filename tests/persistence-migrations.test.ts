import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { afterAll, describe, expect, it } from 'vitest';

import { MigrationRunner, PgliteSession } from '@gta6-rp/persistence';

const MIGRATIONS_DIR = resolve(process.cwd(), 'infrastructure/database/migrations');

const opened: { sql: PgliteSession; directory: string }[] = [];

async function freshDatabase(directory: string): Promise<PgliteSession> {
  const sql = new PgliteSession(new PGlite(directory));
  opened.push({ sql, directory });
  return sql;
}

async function newScratchDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'calm-migrations-'));
}

afterAll(async () => {
  await Promise.all(
    opened.map(({ sql, directory }) =>
      sql
        .close()
        .catch(() => undefined)
        .then(() => rm(directory, { recursive: true, force: true })),
    ),
  );
});

describe('migration runner (embedded PostgreSQL)', () => {
  it('rolls back the schema when migration bookkeeping fails', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    const runner = new MigrationRunner(session);
    await runner.applied();
    await session.executeScript(`
      CREATE FUNCTION reject_migration_bookkeeping() RETURNS trigger AS $
      BEGIN
        RAISE EXCEPTION 'simulated bookkeeping failure';
      END;
      $ LANGUAGE plpgsql;
      CREATE TRIGGER reject_migration_bookkeeping
        BEFORE INSERT ON schema_migrations
        FOR EACH ROW EXECUTE FUNCTION reject_migration_bookkeeping();
    `);

    await expect(runner.applyDirectory(MIGRATIONS_DIR)).rejects.toThrow(
      'simulated bookkeeping failure',
    );
    const tables = await session.query(
      `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'accounts'`,
    );
    expect(tables.rows).toEqual([]);
    expect(await runner.applied()).toEqual([]);
  });

  it('applies every pending migration in file order, exactly once', async () => {
    const session = await freshDatabase(await newScratchDirectory());
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
    const session = await freshDatabase(await newScratchDirectory());
    const runner = new MigrationRunner(session);
    await runner.applyDirectory(MIGRATIONS_DIR);

    const second = await runner.applyDirectory(MIGRATIONS_DIR);

    expect(second).toEqual([]);
    const recorded = await runner.applied();
    expect(recorded.map((migration) => migration.name)).toHaveLength(2);
  });

  it('never reapplies migrations after a full restart of the database engine', async () => {
    const directory = await newScratchDirectory();
    const first = await freshDatabase(directory);
    await new MigrationRunner(first).applyDirectory(MIGRATIONS_DIR);
    await first.close();

    const second = await freshDatabase(directory);
    const applied = await new MigrationRunner(second).applyDirectory(MIGRATIONS_DIR);

    expect(applied).toEqual([]);
    const characters = await second.query(
      `SELECT first_name, last_name FROM characters WHERE id = '00000000-0000-4000-8000-0000000000f2'`,
    );
    expect(characters.rows).toEqual([{ first_name: 'CALM Treasury', last_name: 'System' }]);
  });

  it('seeds the reserved treasury account exactly once across restarts', async () => {
    const directory = await newScratchDirectory();
    const first = await freshDatabase(directory);
    await new MigrationRunner(first).applyDirectory(MIGRATIONS_DIR);
    await first.close();

    const reopened = await freshDatabase(directory);
    const accounts = await reopened.query('SELECT count(*)::int AS n FROM financial_accounts');

    expect(accounts.rows[0]).toEqual({ n: 1 });
  });
});
