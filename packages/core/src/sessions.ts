import { createHash, randomBytes } from 'node:crypto';

import { DomainError, newUuid, requireUuid } from './index.js';
import type { Clock, Capability } from './index.js';
import type { Uuid } from './index.js';

/** Capabilities a server may grant to a session. Extend per domain module. */
export const SESSION_CAPABILITIES: readonly Capability[] = Object.freeze([
  'economy.grant',
  'inventory.mint',
]);

/**
 * Trusted principal resolved from a server-issued session. Clients present an
 * opaque token; the account identity is read from durable storage, never
 * from the request payload.
 */
export interface SessionPrincipal {
  readonly accountId: Uuid;
  readonly capabilities: readonly Capability[];
}

/** The durable session record as stored (only the token hash is persisted). */
export interface SessionRecord {
  readonly sessionId: Uuid;
  readonly accountId: Uuid;
  readonly tokenHash: string;
  readonly capabilities: readonly Capability[];
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface SessionStore {
  /** Persist a newly issued session. Token hashes are unique. */
  create(record: SessionRecord): Promise<void>;
  /** Resolve the stored session for a token hash, or `null` when unknown. */
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>;
  /**
   * Revoke the session idempotently.
   * Returns `true` when the session existed and was still active.
   */
  revoke(sessionId: Uuid, revokedAt: Date): Promise<boolean>;
}

export interface IssueSessionCommand {
  readonly accountId: Uuid;
  readonly capabilities: readonly Capability[];
  readonly ttlMs: number;
}

export interface IssuedSession {
  /** Opaque bearer token. Shown once at issue time; only its hash is stored. */
  readonly token: string;
  readonly session: SessionRecord;
}

/** Injected randomness so token generation stays deterministic in tests. */
export interface RandomSource {
  bytes(count: number): Uint8Array;
}

/** Injected hashing so token-hash derivation stays deterministic in tests. */
export interface HashSource {
  sha256Hex(input: string): string;
}

export const nodeRandomSource: RandomSource = { bytes: (count) => randomBytes(count) };
export const nodeHashSource: HashSource = {
  sha256Hex: (input) => createHash('sha256').update(input).digest('hex'),
};

const TOKEN_BYTES = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const MIN_TTL_MS = 1_000;
// Bound bearer-token exposure even if an internal caller requests an excessive lifetime.
const MAX_TTL_MS = 30 * 24 * 60 * 60 * 1_000;

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

function sessionSnapshot(record: SessionRecord): SessionRecord {
  return Object.freeze({
    ...record,
    capabilities: Object.freeze([...record.capabilities]),
    issuedAt: new Date(record.issuedAt.getTime()),
    expiresAt: new Date(record.expiresAt.getTime()),
    revokedAt: record.revokedAt === null ? null : new Date(record.revokedAt.getTime()),
  });
}

/**
 * Server-authoritative session authentication.
 *
 * Identity is minted here, server-side: `issue` binds an account to a fresh
 * random token, persists only the SHA-256 hash, and `authenticate` resolves
 * the account back from the presented token. No command path accepts an
 * account identifier from the wire, so a client cannot claim an identity.
 */
export class SessionService {
  readonly #store: SessionStore;
  readonly #clock: Clock;
  readonly #random: RandomSource;
  readonly #hashing: HashSource;

  public constructor(
    store: SessionStore,
    options: { clock?: Clock; random?: RandomSource; hashing?: HashSource } = {},
  ) {
    this.#store = store;
    this.#clock = options.clock ?? { now: () => new Date() };
    this.#random = options.random ?? nodeRandomSource;
    this.#hashing = options.hashing ?? nodeHashSource;
  }

  public async issue(command: IssueSessionCommand): Promise<IssuedSession> {
    const accountId = requireUuid(command.accountId, 'account ID');
    if (
      !Array.isArray(command.capabilities) ||
      command.capabilities.some((capability) => !SESSION_CAPABILITIES.includes(capability))
    ) {
      throw new DomainError('INVALID_CAPABILITY', 'Unknown session capability requested.');
    }
    if (
      !Number.isSafeInteger(command.ttlMs) ||
      command.ttlMs < MIN_TTL_MS ||
      command.ttlMs > MAX_TTL_MS
    ) {
      throw new DomainError(
        'INVALID_TTL',
        `Session TTL must be between ${MIN_TTL_MS} and ${MAX_TTL_MS} ms.`,
      );
    }
    const clockValue = this.#clock.now();
    if (!(clockValue instanceof Date) || !Number.isFinite(clockValue.getTime())) {
      throw new DomainError('INVALID_CLOCK', 'Session clock must return a valid date.');
    }
    const issuedAt = new Date(clockValue.getTime());
    const expiresAt = new Date(issuedAt.getTime() + command.ttlMs);
    if (!Number.isFinite(expiresAt.getTime())) {
      throw new DomainError('INVALID_CLOCK', 'Session expiry is outside the supported date range.');
    }
    const tokenBytes = this.#random.bytes(TOKEN_BYTES);
    if (!(tokenBytes instanceof Uint8Array) || tokenBytes.byteLength !== TOKEN_BYTES) {
      throw new DomainError(
        'INVALID_RANDOM_SOURCE',
        'Session token generator returned invalid bytes.',
      );
    }
    const token = toBase64Url(tokenBytes);
    const session = sessionSnapshot({
      sessionId: newUuid(),
      accountId,
      tokenHash: this.#hashing.sha256Hex(token),
      capabilities: Object.freeze([...command.capabilities]),
      issuedAt,
      expiresAt,
      revokedAt: null,
    });
    await this.#store.create(session);
    return { token, session };
  }

  /** Resolve an active session from its bearer token, or `null`. */
  public async authenticate(token: string): Promise<SessionRecord | null> {
    if (typeof token !== 'string') return null;
    const candidate = token.trim();
    if (!TOKEN_PATTERN.test(candidate)) return null;
    const record = await this.#store.findByTokenHash(this.#hashing.sha256Hex(candidate));
    if (record === null) return null;
    if (record.revokedAt !== null) return null;
    if (
      !Array.isArray(record.capabilities) ||
      record.capabilities.some((capability) => !SESSION_CAPABILITIES.includes(capability))
    ) {
      return null;
    }
    const now = this.#clock.now();
    if (
      !(now instanceof Date) ||
      !(record.issuedAt instanceof Date) ||
      !(record.expiresAt instanceof Date)
    ) {
      return null;
    }
    const nowMs = now.getTime();
    const issuedAtMs = record.issuedAt.getTime();
    const expiresAtMs = record.expiresAt.getTime();
    if (
      !Number.isFinite(nowMs) ||
      !Number.isFinite(issuedAtMs) ||
      !Number.isFinite(expiresAtMs) ||
      issuedAtMs > nowMs ||
      expiresAtMs <= issuedAtMs ||
      expiresAtMs - issuedAtMs > MAX_TTL_MS ||
      nowMs >= expiresAtMs
    ) {
      return null;
    }
    return sessionSnapshot(record);
  }

  /** Revoke a session; idempotent and server-side only. */
  public async revoke(sessionId: Uuid): Promise<boolean> {
    const id = requireUuid(sessionId, 'session ID');
    const revokedAt = this.#clock.now();
    if (!(revokedAt instanceof Date) || !Number.isFinite(revokedAt.getTime())) {
      throw new DomainError('INVALID_CLOCK', 'Session clock must return a valid date.');
    }
    return this.#store.revoke(id, new Date(revokedAt.getTime()));
  }

  /** The trusted principal a resolved session carries into domain services. */
  public principalOf(session: SessionRecord): SessionPrincipal {
    return Object.freeze({
      accountId: requireUuid(session.accountId, 'session account ID'),
      capabilities: Object.freeze([...session.capabilities]),
    });
  }
}

/** Deterministic in-memory session store for the simulator and unit tests. */
export class InMemorySessionStore implements SessionStore {
  readonly #byId = new Map<Uuid, SessionRecord>();

  public async create(record: SessionRecord): Promise<void> {
    if (this.#byId.has(record.sessionId)) {
      throw new DomainError('SESSION_EXISTS', 'Session ID is already registered.');
    }
    for (const existing of this.#byId.values()) {
      if (existing.tokenHash === record.tokenHash) {
        throw new DomainError('SESSION_TOKEN_EXISTS', 'Token hash is already registered.');
      }
    }
    this.#byId.set(record.sessionId, sessionSnapshot(record));
  }

  public async findByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    for (const record of this.#byId.values()) {
      if (record.tokenHash === tokenHash) return sessionSnapshot(record);
    }
    return null;
  }

  public async revoke(sessionId: Uuid, revokedAt: Date): Promise<boolean> {
    const record = this.#byId.get(sessionId);
    if (!record || record.revokedAt !== null) return false;
    this.#byId.set(sessionId, sessionSnapshot({ ...record, revokedAt }));
    return true;
  }
}
