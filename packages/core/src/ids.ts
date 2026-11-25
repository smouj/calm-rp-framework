import { randomUUID } from 'node:crypto';

import { DomainError } from './index.js';
import type { Brand } from './index.js';

/**
 * Canonical durable identifier form: a lowercase RFC 4122 UUID string.
 *
 * The historical in-memory reference accepts a wider identifier pattern
 * (`roleplay.ts`); every persistent store must use exactly this UUID form so
 * that domain types and the PostgreSQL UUID columns (migration `0001`) stay
 * coherent — one identifier representation, validated identically at every
 * boundary that reads from or writes to durable storage.
 */
export type Uuid = Brand<string, 'Uuid'>;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const isUuid = (value: string): value is Uuid => UUID_PATTERN.test(value);

/** Generate a fresh random (version 4) UUID identifier. */
export const newUuid = (): Uuid => randomUUID() as Uuid;

/**
 * Parse an external identifier into the canonical UUID form: surrounding
 * whitespace is trimmed and uppercase ASCII hex is folded to lowercase before
 * validation, so `AB…` and `ab…` denote the same durable identifier.
 * Anything that is not a canonical UUID after normalization is rejected.
 */
export const requireUuid = (value: string, label: string): Uuid => {
  const candidate = value.trim().toLowerCase();
  if (!isUuid(candidate)) {
    throw new DomainError('INVALID_IDENTIFIER', `Invalid ${label}: a canonical UUID is required.`);
  }
  return candidate;
};
