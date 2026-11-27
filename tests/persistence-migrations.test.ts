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
      await executor.query(
        `INSERT INTO ledger_transaction_finalizations (transaction_id) VALUES ($1::uuid)`,
        [transactionId],
      );
    });

    const unfinalizedTransactionId = '00000000-0000-4000-8000-0000000000a4';
    await expect(
      session.withTransaction((executor) =>
        executor.query(
          `INSERT INTO ledger_transactions (id, idempotency_key, command_fingerprint)
           VALUES ($1::uuid, 'unfinalized-test', 'unfinalized-test')`,
          [unfinalizedTransactionId],
        ),
      ),
    ).rejects.toThrow('must be finalized before commit');
    const rolledBack = await session.query(
      'SELECT count(*)::int AS n FROM ledger_transactions WHERE id = $1::uuid',
      [unfinalizedTransactionId],
    );
    expect(rolledBack.rows[0]).toEqual({ n: 0 });

    await expect(
      session.query(
        `INSERT INTO ledger_entries (id, transaction_id, financial_account_id, amount_minor)
         VALUES ('00000000-0000-4000-8000-0000000000a5'::uuid, $1::uuid, $2::uuid, 1)`,
        [transactionId, treasuryId],
      ),
    ).rejects.toThrow('finalized');

    const mutations: readonly [string, readonly string[]][] = [
      ['UPDATE ledger_entries SET amount_minor = 30 WHERE id = $1::uuid', [entryId]],
      ['DELETE FROM ledger_entries WHERE id = $1::uuid', [entryId]],
      ['UPDATE ledger_transactions SET reference = NULL WHERE id = $1::uuid', [transactionId]],
      ['DELETE FROM ledger_transactions WHERE id = $1::uuid', [transactionId]],
      [
        'UPDATE ledger_transaction_finalizations SET finalized_at = now() WHERE transaction_id = $1::uuid',
        [transactionId],
      ],
      [
        'DELETE FROM ledger_transaction_finalizations WHERE transaction_id = $1::uuid',
        [transactionId],
      ],
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
      '0004_ledger_transaction_finalization.sql',
      '0005_persistent_inventory.sql',
    ]);

    const tables = await session.query(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name`,
    );
    expect(tables.rows.map((row) => String(row['table_name']))).toContain('ledger_entries');
    expect(tables.rows.map((row) => String(row['table_name']))).toContain('sessions');
    expect(tables.rows.map((row) => String(row['table_name']))).toContain('inventory_stacks');
  });

  it('is idempotent: a second run applies nothing and lists what is applied', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    const runner = new MigrationRunner(session);
    await runner.applyDirectory(MIGRATIONS_DIR);

    const second = await runner.applyDirectory(MIGRATIONS_DIR);

    expect(second).toEqual([]);
    const recorded = await runner.applied();
    expect(recorded.map((migration) => migration.name)).toHaveLength(5);
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

  it('keeps item ownership independent from a vehicle storage location and guards capacity', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    await new MigrationRunner(session).applyDirectory(MIGRATIONS_DIR);
    const ownerId = '00000000-0000-4000-8000-0000000000f2';
    const containerOwnerId = '00000000-0000-4000-8000-0000000005a5';
    const containerOwnerAccountId = '00000000-0000-4000-8000-0000000005a6';
    const containerId = '00000000-0000-4000-8000-0000000005a1';
    const locationId = '00000000-0000-4000-8000-0000000005a2';

    await session.query('INSERT INTO accounts (id) VALUES ($1::uuid)', [containerOwnerAccountId]);
    await session.query(
      `INSERT INTO characters (id, account_id, first_name, last_name)
       VALUES ($1::uuid, $2::uuid, 'Container', 'Owner')`,
      [containerOwnerId, containerOwnerAccountId],
    );
    await session.query(
      `INSERT INTO inventory_item_definitions (id, display_name, weight_grams, max_stack, tradeable)
       VALUES ('test:parcel', 'Synthetic parcel', 10, 20, true)`,
    );
    await session.query(
      `INSERT INTO inventory_containers
         (id, kind, location_id, owner_character_id, slot_capacity, weight_capacity_grams)
       VALUES ($1::uuid, 'vehicle', $2::uuid, $3::uuid, 1, 50)`,
      [containerId, locationId, containerOwnerId],
    );
    await session.query(
      `INSERT INTO inventory_stacks (id, container_id, owner_character_id, item_id, quantity)
       VALUES ('00000000-0000-4000-8000-0000000005a3'::uuid, $1::uuid, $2::uuid, 'test:parcel', 5)`,
      [containerId, ownerId],
    );

    const stored = await session.query(
      `SELECT c.kind, c.location_id, c.owner_character_id AS container_owner,
              s.owner_character_id AS item_owner, s.quantity
         FROM inventory_containers c JOIN inventory_stacks s ON s.container_id = c.id
        WHERE c.id = $1::uuid`,
      [containerId],
    );
    expect(stored.rows).toEqual([
      {
        kind: 'vehicle',
        location_id: locationId,
        container_owner: containerOwnerId,
        item_owner: ownerId,
        quantity: 5,
      },
    ]);

    await expect(
      session.query(
        `INSERT INTO inventory_stacks (id, container_id, owner_character_id, item_id, quantity, metadata)
         VALUES ('00000000-0000-4000-8000-0000000005a4'::uuid, $1::uuid, $2::uuid,
                 'test:parcel', 1, '{"quality":"sealed"}'::jsonb)`,
        [containerId, ownerId],
      ),
    ).rejects.toThrow('slot capacity exceeded');

    await expect(
      session.query(
        'UPDATE inventory_containers SET weight_capacity_grams = 49 WHERE id = $1::uuid',
        [containerId],
      ),
    ).rejects.toThrow('weight capacity is below current usage');

    await expect(
      session.query('UPDATE inventory_item_definitions SET weight_grams = 11 WHERE id = $1', [
        'test:parcel',
      ]),
    ).rejects.toThrow('append-only');

    const lowCapacityContainerId = '00000000-0000-4000-8000-0000000005a7';
    const lowCapacityLocationId = '00000000-0000-4000-8000-0000000005a8';
    await session.query(
      `INSERT INTO inventory_containers
         (id, kind, location_id, owner_character_id, slot_capacity, weight_capacity_grams)
       VALUES ($1::uuid, 'property', $2::uuid, $3::uuid, 4, 49)`,
      [lowCapacityContainerId, lowCapacityLocationId, containerOwnerId],
    );
    await expect(
      session.query(
        `INSERT INTO inventory_stacks (id, container_id, owner_character_id, item_id, quantity)
         VALUES ('00000000-0000-4000-8000-0000000005a9'::uuid, $1::uuid, $2::uuid,
                 'test:parcel', 5)`,
        [lowCapacityContainerId, ownerId],
      ),
    ).rejects.toThrow('weight capacity exceeded');
  });

  it('requires a finalized operation with one immutable movement', async () => {
    const session = await freshDatabase(await newScratchDirectory());
    await new MigrationRunner(session).applyDirectory(MIGRATIONS_DIR);
    const operationId = '00000000-0000-4000-8000-0000000005b1';
    const movementId = '00000000-0000-4000-8000-0000000005b2';
    const containerId = '00000000-0000-4000-8000-0000000005b3';
    const locationId = '00000000-0000-4000-8000-0000000005b4';
    const destinationContainerId = '00000000-0000-4000-8000-0000000005b6';
    const destinationLocationId = '00000000-0000-4000-8000-0000000005b7';
    const ownerId = '00000000-0000-4000-8000-0000000000f2';

    await session.query(
      `INSERT INTO inventory_item_definitions (id, display_name, weight_grams, max_stack, tradeable)
       VALUES ('test:receipt', 'Receipt test item', 1, 5, true)`,
    );
    await session.query(
      `INSERT INTO inventory_item_definitions (id, display_name, weight_grams, max_stack, tradeable)
       VALUES ('test:bound', 'Bound test item', 1, 5, false)`,
    );
    await session.query(
      `INSERT INTO inventory_containers
         (id, kind, location_id, owner_character_id, slot_capacity, weight_capacity_grams)
       VALUES ($1::uuid, 'vehicle', $2::uuid, $3::uuid, 10, 100)`,
      [containerId, locationId, ownerId],
    );
    await session.query(
      `INSERT INTO inventory_containers
         (id, kind, location_id, owner_character_id, slot_capacity, weight_capacity_grams)
       VALUES ($1::uuid, 'property', $2::uuid, $3::uuid, 10, 100)`,
      [destinationContainerId, destinationLocationId, ownerId],
    );

    await expect(
      session.withTransaction((executor) =>
        executor.query(
          `INSERT INTO inventory_operations
             (id, idempotency_key, command_fingerprint, kind, actor_account_id, actor_character_id)
           VALUES ($1::uuid, 'missing-movement', repeat('a', 64), 'mint',
                   '00000000-0000-4000-8000-0000000000f1'::uuid, $2::uuid)`,
          [operationId, ownerId],
        ),
      ),
    ).rejects.toThrow('must be finalized before commit');

    await session.withTransaction(async (executor) => {
      await executor.query(
        `INSERT INTO inventory_operations
           (id, idempotency_key, command_fingerprint, kind, actor_account_id, actor_character_id)
         VALUES ($1::uuid, 'inventory-receipt', repeat('b', 64), 'mint',
                 '00000000-0000-4000-8000-0000000000f1'::uuid, $2::uuid)`,
        [operationId, ownerId],
      );
      await executor.query(
        `INSERT INTO inventory_movements
           (id, operation_id, operation_kind, item_id, destination_container_id,
            destination_owner_character_id, quantity)
         VALUES ($1::uuid, $2::uuid, 'mint', 'test:receipt', $3::uuid, $4::uuid, 2)`,
        [movementId, operationId, containerId, ownerId],
      );
      await executor.query(
        'INSERT INTO inventory_operation_finalizations (operation_id) VALUES ($1::uuid)',
        [operationId],
      );
    });

    await expect(
      session.query(
        `INSERT INTO inventory_movements
           (id, operation_id, operation_kind, item_id, destination_container_id,
            destination_owner_character_id, quantity)
         VALUES ('00000000-0000-4000-8000-0000000005b5'::uuid, $1::uuid, 'mint',
                 'test:receipt', $2::uuid, $3::uuid, 1)`,
        [operationId, containerId, ownerId],
      ),
    ).rejects.toThrow('finalized');
    await expect(
      session.query('DELETE FROM inventory_movements WHERE id = $1::uuid', [movementId]),
    ).rejects.toThrow('append-only');
    await expect(
      session.query('DELETE FROM inventory_operations WHERE id = $1::uuid', [operationId]),
    ).rejects.toThrow('append-only');

    await expect(
      session.withTransaction(async (executor) => {
        await executor.query(
          `INSERT INTO inventory_operations
             (id, idempotency_key, command_fingerprint, kind, actor_account_id, actor_character_id)
           VALUES ('00000000-0000-4000-8000-0000000005b8'::uuid, 'bound-transfer', repeat('c', 64),
                   'transfer', '00000000-0000-4000-8000-0000000000f1'::uuid, $1::uuid)`,
          [ownerId],
        );
        await executor.query(
          `INSERT INTO inventory_movements
             (id, operation_id, operation_kind, item_id, source_container_id,
              destination_container_id, source_owner_character_id, destination_owner_character_id, quantity)
           VALUES ('00000000-0000-4000-8000-0000000005b9'::uuid,
                   '00000000-0000-4000-8000-0000000005b8'::uuid, 'transfer', 'test:bound',
                   $1::uuid, $2::uuid, $3::uuid, '00000000-0000-4000-8000-0000000000f2'::uuid, 1)`,
          [containerId, destinationContainerId, ownerId],
        );
      }),
    ).rejects.toThrow('not tradeable');

    const history = await session.query(
      `SELECT o.idempotency_key, m.operation_kind, m.quantity, f.operation_id
         FROM inventory_operations o
         JOIN inventory_movements m ON m.operation_id = o.id
         JOIN inventory_operation_finalizations f ON f.operation_id = o.id
        WHERE o.id = $1::uuid`,
      [operationId],
    );
    expect(history.rows).toEqual([
      {
        idempotency_key: 'inventory-receipt',
        operation_kind: 'mint',
        quantity: 2,
        operation_id: operationId,
      },
    ]);
  });
});
