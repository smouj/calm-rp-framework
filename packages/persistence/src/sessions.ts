import { DomainError } from '@gta6-rp/core';
import type { Capability, SessionRecord, SessionStore, Uuid } from '@gta6-rp/core';

import { isUniqueViolation } from './sql.js';
import { readTimestamp, readTimestampOrNull, type SqlSession } from './sql.js';

const KNOWN_CAPABILITIES: readonly Capability[] = ['economy.grant', 'inventory.mint'];

function parseCapabilities(raw: unknown): readonly Capability[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(raw));
  } catch {
    throw new DomainError('SESSION_CORRUPT', 'Stored session capabilities are not valid JSON.');
  }
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
    throw new DomainError('SESSION_CORRUPT', 'Stored session capabilities are not a string list.');
  }
  const capabilities = parsed as string[];
  if (capabilities.some((capability) => !KNOWN_CAPABILITIES.includes(capability as Capability))) {
    throw new DomainError('SESSION_CORRUPT', 'Stored session capability is not recognized.');
  }
  return Object.freeze(capabilities as readonly Capability[]);
}

const SELECT_SESSION = `
  SELECT id, account_id, token_hash, capabilities, issued_at, expires_at, revoked_at
    FROM sessions`;

function rowToSession(row: Record<string, unknown>): SessionRecord {
  return {
    sessionId: String(row['id']) as Uuid,
    accountId: String(row['account_id']) as Uuid,
    tokenHash: String(row['token_hash']),
    capabilities: parseCapabilities(row['capabilities']),
    issuedAt: readTimestamp(row, 'issued_at'),
    expiresAt: readTimestamp(row, 'expires_at'),
    revokedAt: readTimestampOrNull(row, 'revoked_at'),
  };
}

/**
 * Session storage over PostgreSQL. The bearer token itself never reaches the
 * database — only its SHA-256 hash does, unique across all sessions.
 */
export class PgSessionRepository implements SessionStore {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async create(record: SessionRecord): Promise<void> {
    try {
      await this.#sql.query(
        `INSERT INTO sessions (id, account_id, token_hash, capabilities, issued_at, expires_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5::timestamptz, $6::timestamptz)`,
        [
          record.sessionId,
          record.accountId,
          record.tokenHash,
          JSON.stringify([...record.capabilities]),
          record.issuedAt.toISOString(),
          record.expiresAt.toISOString(),
        ],
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new DomainError('SESSION_EXISTS', 'Session identifier or token already registered.');
      }
      throw error;
    }
  }

  public async findByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    const result = await this.#sql.query(`${SELECT_SESSION} WHERE token_hash = $1`, [tokenHash]);
    const row = result.rows[0];
    return row === undefined ? null : rowToSession(row);
  }

  public async revoke(sessionId: Uuid, revokedAt: Date): Promise<boolean> {
    const result = await this.#sql.query(
      `UPDATE sessions SET revoked_at = $2::timestamptz
         WHERE id = $1::uuid AND revoked_at IS NULL RETURNING id`,
      [sessionId, revokedAt.toISOString()],
    );
    return result.rows.length > 0;
  }
}
