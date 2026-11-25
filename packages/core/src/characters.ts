import { DomainError, newUuid, requireUuid } from './index.js';
import type { Clock, SessionPrincipal, Uuid } from './index.js';

/** A durable character owned by exactly one account. */
export interface PersistentCharacter {
  readonly id: Uuid;
  readonly accountId: Uuid;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly retiredAt: Date | null;
}

/** Server-issued creation command; the owning account comes from the session. */
export interface CreateCharacterCommand {
  readonly firstName: string;
  readonly lastName: string;
}

export interface CharacterStore {
  /** Insert a character; `CHARACTER_EXISTS` on a duplicate id, `ACCOUNT_NOT_FOUND` for an unknown account. */
  insert(character: PersistentCharacter): Promise<void>;
  findById(id: Uuid): Promise<PersistentCharacter | null>;
  /** Active (non-retired) characters of one account. */
  listByAccount(accountId: Uuid): Promise<readonly PersistentCharacter[]>;
  /** Retire idempotently; `true` when it existed and was still active. */
  retire(id: Uuid, retiredAt: Date): Promise<boolean>;
}

const NAME_PATTERN_MAX = 64;

function validateName(value: string, label: string): string {
  if (typeof value !== 'string') {
    throw new DomainError('INVALID_NAME', `${label} must be a string.`);
  }
  const name = value.trim();
  if (name.length < 1 || name.length > NAME_PATTERN_MAX) {
    throw new DomainError(
      'INVALID_NAME',
      `${label} must contain 1 to ${NAME_PATTERN_MAX} characters.`,
    );
  }
  if (/[\u0000-\u001f\u007f]/.test(name)) {
    throw new DomainError('INVALID_NAME', `${label} must contain printable characters only.`);
  }
  return name;
}

/**
 * Persistent character lifecycle: creation, recovery and ownership control.
 *
 * Ownership is established by construction — `create` derives the owning
 * account from the authenticated session principal, never from client
 * input — and every later operation re-checks it, so a character can only
 * be read-listed, retired or mutated by the account that created it.
 */
export class CharacterService {
  readonly #store: CharacterStore;
  readonly #clock: Clock;

  public constructor(store: CharacterStore, options: { clock?: Clock } = {}) {
    this.#store = store;
    this.#clock = options.clock ?? { now: () => new Date() };
  }

  public async create(
    principal: SessionPrincipal,
    command: CreateCharacterCommand,
  ): Promise<PersistentCharacter> {
    const accountId = requireUuid(principal.accountId, 'account ID');
    const firstName = validateName(command.firstName, 'First name');
    const lastName = validateName(command.lastName, 'Last name');
    const character: PersistentCharacter = {
      id: newUuid(),
      accountId,
      firstName,
      lastName,
      createdAt: this.#clock.now(),
      retiredAt: null,
    };
    await this.#store.insert(character);
    return character;
  }

  /** Recover one character by id, including retired ones (read-only path). */
  public async get(id: Uuid): Promise<PersistentCharacter | null> {
    const characterId = requireUuid(id, 'character ID');
    return this.#store.findById(characterId);
  }

  /** Active characters owned by the session's account. */
  public async listOwn(principal: SessionPrincipal): Promise<readonly PersistentCharacter[]> {
    const accountId = requireUuid(principal.accountId, 'account ID');
    return this.#store.listByAccount(accountId);
  }

  /** Load a character and enforce that the session's account owns it. */
  public async requireOwn(
    principal: SessionPrincipal,
    id: Uuid,
  ): Promise<PersistentCharacter> {
    const characterId = requireUuid(id, 'character ID');
    const character = await this.#store.findById(characterId);
    if (character === null) {
      throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    }
    if (character.accountId !== requireUuid(principal.accountId, 'account ID')) {
      throw new DomainError(
        'FORBIDDEN',
        'The character does not belong to the authenticated account.',
      );
    }
    return character;
  }

  /** Retire a character the session's account owns; idempotent. */
  public async retire(principal: SessionPrincipal, id: Uuid): Promise<boolean> {
    const character = await this.requireOwn(principal, id);
    return this.#store.retire(character.id, this.#clock.now());
  }
}

/**
 * Deterministic in-memory character store for the simulator and unit tests.
 * Mirrors the PostgreSQL contract: duplicate ids are rejected, unknown
 * accounts are rejected, retired characters leave the account listing.
 */
export class InMemoryCharacterStore implements CharacterStore {
  readonly #characters = new Map<Uuid, PersistentCharacter>();
  readonly #knownAccounts: ReadonlySet<Uuid>;

  public constructor(options: { knownAccounts?: Iterable<Uuid> } = {}) {
    this.#knownAccounts = new Set(options.knownAccounts ?? []);
  }

  public async insert(character: PersistentCharacter): Promise<void> {
    if (this.#characters.has(character.id)) {
      throw new DomainError('CHARACTER_EXISTS', 'Character ID is already registered.');
    }
    if (!this.#knownAccounts.has(character.accountId)) {
      throw new DomainError('ACCOUNT_NOT_FOUND', 'The owning account does not exist.');
    }
    this.#characters.set(character.id, character);
  }

  public async findById(id: Uuid): Promise<PersistentCharacter | null> {
    return this.#characters.get(id) ?? null;
  }

  public async listByAccount(accountId: Uuid): Promise<readonly PersistentCharacter[]> {
    const owned = [...this.#characters.values()]
      .filter((character) => character.accountId === accountId && character.retiredAt === null)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime() || (a.id < b.id ? -1 : 1));
    return Object.freeze(owned);
  }

  public async retire(id: Uuid, retiredAt: Date): Promise<boolean> {
    const character = this.#characters.get(id);
    if (!character || character.retiredAt !== null) return false;
    this.#characters.set(id, { ...character, retiredAt });
    return true;
  }
}
