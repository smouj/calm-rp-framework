import type { Uuid } from '@gta6-rp/core';

import { readTimestamp, type SqlSession } from './sql.js';

export interface AccountRow {
  readonly id: Uuid;
  readonly createdAt: Date;
}

/**
 * Accounts are the durable identity root every session and character hangs
 * from. `ensureAccount` is idempotent — registering an already-known account
 * is not an error, so restarts and replays converge on the same state.
 */
export class PgAccountRepository {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async ensureAccount(accountId: Uuid): Promise<void> {
    await this.#sql.query(
      `INSERT INTO accounts (id) VALUES ($1::uuid)
         ON CONFLICT (id) DO NOTHING`,
      [accountId],
    );
  }

  public async listAccounts(): Promise<readonly AccountRow[]> {
    const result = await this.#sql.query(
      `SELECT id, created_at FROM accounts ORDER BY created_at, id`,
    );
    return result.rows.map((row) => ({
      id: String(row['id']) as Uuid,
      createdAt: readTimestamp(row, 'created_at'),
    }));
  }
}
