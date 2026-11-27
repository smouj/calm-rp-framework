import { DomainError, newUuid } from '@gta6-rp/core';
import type {
  LedgerEntryLine,
  LedgerLeg,
  LedgerStore,
  PostedTransaction,
  PostTransactionCommand,
  Uuid,
} from '@gta6-rp/core';

import { readBigInt, readTimestamp, type SqlExecutor, type SqlSession } from './sql.js';

const SELECT_TRANSACTION = `
  SELECT t.id, t.idempotency_key, t.command_fingerprint, t.created_at
    FROM ledger_transactions t`;

const TREASURY_ACCOUNT_ID = '00000000-0000-4000-8000-0000000000f3';
const MAX_ACCOUNT_BALANCE = 10_000_000_000_000n;

function uuidList(start: number, count: number): string {
  return Array.from({ length: count }, (_, index) => `$${start + index}::uuid`).join(', ');
}

async function loadExisting(
  executor: SqlExecutor,
  idempotencyKey: string,
): Promise<{ transactionId: Uuid; fingerprint: string | null } | null> {
  const result = await executor.query(`${SELECT_TRANSACTION} WHERE idempotency_key = $1`, [
    idempotencyKey,
  ]);
  const row = result.rows[0];
  if (row === undefined) return null;
  return {
    transactionId: String(row['id']) as Uuid,
    fingerprint: typeof row['command_fingerprint'] === 'string' ? row['command_fingerprint'] : null,
  };
}

async function loadLegs(executor: SqlExecutor, transactionId: Uuid): Promise<LedgerLeg[]> {
  const result = await executor.query(
    `SELECT financial_account_id, amount_minor FROM ledger_entries
       WHERE transaction_id = $1::uuid ORDER BY financial_account_id`,
    [transactionId],
  );
  return result.rows.map((row) => ({
    financialAccountId: String(row['financial_account_id']) as Uuid,
    amountMinor: readBigInt(row, 'amount_minor'),
  }));
}

/**
 * Durable double-entry ledger over PostgreSQL.
 *
 * `post` runs in one transaction that:
 * 1. resolves an existing idempotency key (replay → original receipt;
 *    different fingerprint → `IDEMPOTENCY_CONFLICT`, nothing written);
 * 2. inserts the transaction row (unique key; a concurrent writer that wins
 *    the race is detected via the unique violation and treated as a replay);
 * 3. locks every touched financial account row (`FOR UPDATE`, deterministic
 *    order) so concurrent writers serialize;
 * 4. inserts all legs;
 * 5. re-derives each touched account's balance from the sum of its entries
 *    and fails `INSUFFICIENT_FUNDS` if any would go negative — plus the
 *    commit-time constraint trigger that rejects unbalanced transactions
 *    outright, even for direct SQL written outside this repository.
 * 6. finalizes the balanced transaction;
 * 7. writes any privileged-action audit row before committing, so an audit
 *    failure rolls the grant back.
 */
export class PgLedgerRepository implements LedgerStore {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async post(command: PostTransactionCommand): Promise<PostedTransaction> {
    return this.#sql.withTransaction(async (executor) => {
      const existing = await loadExisting(executor, command.idempotencyKey);
      if (existing !== null) {
        return this.#replayOf(executor, existing, command.fingerprint);
      }

      const transactionId = newUuid();
      // ON CONFLICT keeps the transaction usable after concurrent identical keys.
      // Under READ COMMITTED the subsequent SELECT sees the committed winner.
      const inserted = await executor.query(
        `INSERT INTO ledger_transactions (id, idempotency_key, command_fingerprint, reference)
           VALUES ($1::uuid, $2, $3, $4)
           ON CONFLICT (idempotency_key) DO NOTHING
           RETURNING id, created_at`,
        [transactionId, command.idempotencyKey, command.fingerprint, command.reference],
      );
      if (inserted.rows.length === 0) {
        const winner = await loadExisting(executor, command.idempotencyKey);
        if (winner === null) {
          throw new DomainError('LEDGER_CONFLICT', 'Concurrent transaction is not visible.');
        }
        return this.#replayOf(executor, winner, command.fingerprint);
      }

      const accountIds = [...new Set(command.legs.map((leg) => leg.financialAccountId))].sort();
      if (accountIds.length !== command.legs.length) {
        throw new DomainError('UNBALANCED_TRANSACTION', 'One leg per financial account.');
      }
      // Deterministic row locks: concurrent transactions touching the same
      // accounts serialize here instead of deadlocking.
      const locks = await executor.query(
        `SELECT id FROM financial_accounts WHERE id IN (${uuidList(1, accountIds.length)})
           ORDER BY id FOR UPDATE`,
        accountIds,
      );
      if (locks.rows.length !== accountIds.length) {
        throw new DomainError('ACCOUNT_NOT_FOUND', 'Unknown financial account in the legs.');
      }

      const values: string[] = [];
      const params: (string | null)[] = [transactionId];
      command.legs.forEach((leg) => {
        const base = params.length;
        // (entry id, transaction id, financial account id, signed amount)
        values.push(`($${base + 1}::uuid, $1::uuid, $${base + 2}::uuid, $${base + 3}::bigint)`);
        params.push(newUuid(), leg.financialAccountId, leg.amountMinor.toString());
      });
      const entries = await executor.query(
        `INSERT INTO ledger_entries (id, transaction_id, financial_account_id, amount_minor)
           VALUES ${values.join(', ')} RETURNING created_at`,
        params,
      );

      // Authoritative in-transaction invariants: balances are sums of entries.
      // The reserved treasury (money-supply source) may go negative; every
      // other account may not.
      const checkedAccounts = accountIds.filter((id) => id !== TREASURY_ACCOUNT_ID);
      if (checkedAccounts.length > 0) {
        const balances = await executor.query(
          `SELECT e.financial_account_id AS account_id, SUM(e.amount_minor) AS balance
             FROM ledger_entries e
            WHERE e.financial_account_id IN (${uuidList(1, checkedAccounts.length)})
            GROUP BY e.financial_account_id`,
          checkedAccounts,
        );
        for (const row of balances.rows) {
          const balance = readBigInt(row, 'balance');
          if (balance < 0n) {
            throw new DomainError('INSUFFICIENT_FUNDS', 'Insufficient funds.');
          }
          if (balance > MAX_ACCOUNT_BALANCE) {
            throw new DomainError('BALANCE_LIMIT', 'Balance exceeds the allowed limit.');
          }
        }
      }
      const total = await executor.query(
        `SELECT COALESCE(SUM(amount_minor), 0) AS total FROM ledger_entries
           WHERE transaction_id = $1::uuid`,
        [transactionId],
      );
      if (readBigInt(total.rows[0] ?? {}, 'total') !== 0n) {
        throw new DomainError('UNBALANCED_TRANSACTION', 'Transaction legs must sum to zero.');
      }
      if (
        command.privilegedAudit === undefined &&
        command.legs.some((leg) => leg.financialAccountId === TREASURY_ACCOUNT_ID)
      ) {
        throw new DomainError('AUDIT_REQUIRED', 'Treasury postings require a privileged audit.');
      }

      // Close the database transaction only after all legs and account
      // invariants have passed. Database triggers serialize this transition
      // with entry inserts and reject any later append.
      await executor.query(
        `INSERT INTO ledger_transaction_finalizations (transaction_id)
         VALUES ($1::uuid)`,
        [transactionId],
      );

      if (command.privilegedAudit !== undefined) {
        await executor.query(
          `INSERT INTO privileged_action_audits
             (transaction_id, action, actor_account_id, reason, correlation_id)
           VALUES ($1::uuid, $2, $3::uuid, $4, $5)`,
          [
            transactionId,
            command.privilegedAudit.action,
            command.privilegedAudit.actorAccountId,
            command.privilegedAudit.reason,
            command.privilegedAudit.correlationId,
          ],
        );
      }

      return {
        transactionId,
        idempotencyKey: command.idempotencyKey,
        posted: true,
        legs: Object.freeze([...command.legs]),
        createdAt: readTimestamp(entries.rows[0] ?? {}, 'created_at'),
      };
    });
  }

  public async getBalance(financialAccountId: Uuid): Promise<bigint> {
    const result = await this.#sql.query(
      `SELECT COALESCE(SUM(amount_minor), 0) AS balance FROM ledger_entries
         WHERE financial_account_id = $1::uuid`,
      [financialAccountId],
    );
    return readBigInt(result.rows[0] ?? {}, 'balance');
  }

  public async listAccountEntries(
    financialAccountId: Uuid,
    limit: number,
  ): Promise<readonly LedgerEntryLine[]> {
    const result = await this.#sql.query(
      `SELECT e.transaction_id, e.amount_minor, e.created_at, t.idempotency_key
         FROM ledger_entries e
         JOIN ledger_transactions t ON t.id = e.transaction_id
        WHERE e.financial_account_id = $1::uuid
        ORDER BY e.created_at DESC, e.id DESC
        LIMIT $2::int`,
      [financialAccountId, limit],
    );
    return result.rows.map((row) => ({
      transactionId: String(row['transaction_id']) as Uuid,
      idempotencyKey: String(row['idempotency_key']),
      amountMinor: readBigInt(row, 'amount_minor'),
      createdAt: readTimestamp(row, 'created_at'),
    }));
  }

  async #replayOf(
    executor: SqlExecutor,
    existing: { transactionId: Uuid; fingerprint: string | null },
    fingerprint: string,
  ): Promise<PostedTransaction> {
    if (existing.fingerprint !== fingerprint) {
      throw new DomainError(
        'IDEMPOTENCY_CONFLICT',
        'A request ID cannot be reused with different arguments.',
      );
    }
    const legs = await loadLegs(executor, existing.transactionId);
    const result = await executor.query(`${SELECT_TRANSACTION} WHERE id = $1::uuid`, [
      existing.transactionId,
    ]);
    const row = result.rows[0] ?? {};
    return {
      transactionId: existing.transactionId,
      idempotencyKey: String(row['idempotency_key'] ?? ''),
      posted: false,
      legs: Object.freeze(legs),
      createdAt: readTimestamp(row, 'created_at'),
    };
  }
}
