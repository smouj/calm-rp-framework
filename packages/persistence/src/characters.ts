import { DomainError } from '@gta6-rp/core';
import type { CharacterStore, PersistentCharacter, Uuid } from '@gta6-rp/core';

import { isForeignKeyViolation } from './sql.js';
import { readTimestamp, readTimestampOrNull, type SqlSession } from './sql.js';

const SELECT_CHARACTER = `
  SELECT id, account_id, first_name, last_name, created_at, retired_at
    FROM characters`;

function rowToCharacter(row: Record<string, unknown>): PersistentCharacter {
  return {
    id: String(row['id']) as Uuid,
    accountId: String(row['account_id']) as Uuid,
    firstName: String(row['first_name']),
    lastName: String(row['last_name']),
    createdAt: readTimestamp(row, 'created_at'),
    retiredAt: readTimestampOrNull(row, 'retired_at'),
  };
}

/** Durable character storage over PostgreSQL. */
export class PgCharacterRepository implements CharacterStore {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async insert(character: PersistentCharacter): Promise<void> {
    let inserted: number;
    try {
      const result = await this.#sql.query(
        `INSERT INTO characters (id, account_id, first_name, last_name, created_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5::timestamptz)
           ON CONFLICT (id) DO NOTHING
           RETURNING id`,
        [
          character.id,
          character.accountId,
          character.firstName,
          character.lastName,
          character.createdAt.toISOString(),
        ],
      );
      inserted = result.rows.length;
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new DomainError('ACCOUNT_NOT_FOUND', 'The owning account does not exist.');
      }
      throw error;
    }
    if (inserted === 0) {
      throw new DomainError('CHARACTER_EXISTS', 'Character ID is already registered.');
    }
  }

  public async findById(id: Uuid): Promise<PersistentCharacter | null> {
    const result = await this.#sql.query(`${SELECT_CHARACTER} WHERE id = $1::uuid`, [id]);
    const row = result.rows[0];
    return row === undefined ? null : rowToCharacter(row);
  }

  public async listByAccount(accountId: Uuid): Promise<readonly PersistentCharacter[]> {
    const result = await this.#sql.query(
      `${SELECT_CHARACTER} WHERE account_id = $1::uuid AND retired_at IS NULL
         ORDER BY created_at, id`,
      [accountId],
    );
    return result.rows.map(rowToCharacter);
  }

  public async retire(id: Uuid, retiredAt: Date): Promise<boolean> {
    const result = await this.#sql.query(
      `UPDATE characters SET retired_at = $2::timestamptz
         WHERE id = $1::uuid AND retired_at IS NULL RETURNING id`,
      [id, retiredAt.toISOString()],
    );
    return result.rows.length > 0;
  }
}
