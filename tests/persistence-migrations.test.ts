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
    await session.query(
      'ALTER TABLE schema_migrations ADD CONSTRAINT reject_migration_bookkeeping CHECK (false)',
    );

    await expect(runner.applyDirectory(MIGRATIONS_DIR)).rejects.toThrow(
      'reject_migration_bookkeeping',
    );
    const tables = await session.query(
      `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'accounts'`,
    );
    expect(tables.rows).toEqual([]);
    expect(await runner.applied()).toEqual([]);
  });

  it('rejects direct edits and deletions of committed ledger history', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    await new MigrationRunner(session).applyDirectory(MIGRATIONS_DIR);
    const transactionId = '00000000-0000-4000-8000-0000000000a1';
    const entryId = '00000000-0000-4000-8000-0000000000a2';
    const treasuryId = '00000000-0000-4000-8000-0000000000f3';

    await session.withTransaction(async (executor) => {
      await executor.query(
        `INSERT INTO ledger_transactions (id, idempotency_key, command_fingerprint)
         VALUES ($1::uuid, 'append-test', 'append-test')`,
        [transactionId],
      );
      await executor.query(
        `INSERT INTO ledger_entries (id, transaction_id, financial_account_id, amount_minor)
         VALUES ($1::uuid, $2::uuid, $3::uuid, 20),
                ('00000000-0000-4000-8000-0000000000a3'::uuid, $2::uuid, $3::uuid, -20)`,
        [entryId, transactionId, treasuryId],
      );
    });

    const mutations: readonly [string, readonly string[]][] = [
      ['UPDATE ledger_entries SET amount_minor = 30 WHERE id = $1::uuid', [entryId]],
      ['DELETE FROM ledger_entries WHERE id = $1::uuid', [entryId]],
      ['UPDATE ledger_transactions SET reference = \'changed\' WHERE id = $1::uuid', [transactionId]],
      ['DELETE FROM ledger_transactions WHERE id = $1::uuid', [transactionId]],
    ];
    for (const [sql, params] of mutations) {
      await expect(session.query(sql, params)).rejects.toThrow('append-only');
    }
    const entries = await session.query(
      'SELECT count(*)::int AS n FROM ledger_entries WHERE transaction_id = $1::uuid',
      [transactionId],
    );
    expect(entries.rows[0]).toEqual({ n: 2 });
  });

  it('applies every pending migration in file order, exactly once', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    const runner = new MigrationRunner(session);

    const applied = await runner.applyDirectory(MIGRATIONS_DIR);

    expect(applied.map((migration) => migration.name)).toEqual([
      '0001_bootstrap.sql',
      '0002_sessions_ledger_guards.sql',
      '0003_ledger_append_only.sql',
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
    expect(recorded.map((migration) => migration.name)).toHaveLength(3);
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
