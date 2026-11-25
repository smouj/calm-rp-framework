import { DomainError, newUuid } from '@gta6-rp/core';
import type { FinancialAccount, FinancialAccountKind, FinancialAccountStore, Uuid } from '@gta6-rp/core';

import { isForeignKeyViolation } from './sql.js';
import { type SqlSession } from './sql.js';

const TREASURY_ACCOUNT_ID = '00000000-0000-4000-8000-0000000000f3';
const TREASURY_CHARACTER_ID = '00000000-0000-4000-8000-0000000000f2';

const SELECT_ACCOUNT = `
  SELECT id, owner_character_id, kind FROM financial_accounts`;

function rowToAccount(row: Record<string, unknown>): FinancialAccount {
  const kind = String(row['kind']) as FinancialAccountKind;
  if (!['cash', 'bank', 'business', 'escrow'].includes(kind)) {
    throw new DomainError('ACCOUNT_CORRUPT', `Unknown financial account kind: ${kind}`);
  }
  return {
    id: String(row['id']) as Uuid,
    ownerCharacterId: String(row['owner_character_id']) as Uuid,
    kind,
  };
}

/** Durable financial-account provisioning over PostgreSQL. */
export class PgFinancialAccountRepository implements FinancialAccountStore {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async ensureAccount(
    ownerCharacterId: Uuid,
    kind: FinancialAccountKind,
  ): Promise<FinancialAccount> {
    try {
      await this.#sql.query(
        `INSERT INTO financial_accounts (id, owner_character_id, kind)
           VALUES ($1::uuid, $2::uuid, $3)
           ON CONFLICT (owner_character_id, kind) DO NOTHING`,
        [newUuid(), ownerCharacterId, kind],
      );
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown owner character.');
      }
      throw error;
    }
    return (await this.findAccountByOwner(ownerCharacterId, kind))!;
  }

  public async findAccountByOwner(
    ownerCharacterId: Uuid,
    kind: FinancialAccountKind,
  ): Promise<FinancialAccount | null> {
    const result = await this.#sql.query(
      `${SELECT_ACCOUNT} WHERE owner_character_id = $1::uuid AND kind = $2`,
      [ownerCharacterId, kind],
    );
    const row = result.rows[0];
    return row === undefined ? null : rowToAccount(row);
  }

  public async treasuryAccount(): Promise<FinancialAccount> {
    await this.#sql.query(
      `INSERT INTO financial_accounts (id, owner_character_id, kind)
         VALUES ($1::uuid, $2::uuid, 'bank')
         ON CONFLICT (id) DO NOTHING`,
      [TREASURY_ACCOUNT_ID, TREASURY_CHARACTER_ID],
    );
    const result = await this.#sql.query(`${SELECT_ACCOUNT} WHERE id = $1::uuid`, [
      TREASURY_ACCOUNT_ID,
    ]);
    const row = result.rows[0];
    if (row === undefined) {
      throw new DomainError('ACCOUNT_CORRUPT', 'The reserved treasury account is missing.');
    }
    return rowToAccount(row);
  }
}
