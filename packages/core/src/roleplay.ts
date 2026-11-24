import type { AccountId, CharacterId } from './index.js';
import { DomainError } from './index.js';

/**
 * Portable, deterministic IN-MEMORY roleplay reference implementation.
 * No authentication, persistence, locking, transport or GTA VI adapter is provided.
 * Principal must come from a trusted server-side session resolver, never from client JSON.
 */
export type Capability = 'economy.grant' | 'inventory.mint';
export interface Principal {
  readonly accountId: AccountId;
  readonly capabilities: readonly Capability[];
}
export interface CharacterRecord {
  readonly id: CharacterId;
  readonly accountId: AccountId;
  readonly displayName: string;
}
export interface LedgerEntry {
  readonly sequence: number;
  readonly requestId: string;
  readonly operation: 'grant' | 'transfer';
  readonly performedBy: AccountId;
  readonly from: CharacterId | null;
  readonly to: CharacterId;
  readonly amount: bigint;
}
export interface GrantCommand {
  readonly requestId: string;
  readonly to: CharacterId;
  readonly amount: bigint;
}
export interface TransferCommand {
  readonly requestId: string;
  readonly from: CharacterId;
  readonly to: CharacterId;
  readonly amount: bigint;
}

const MAX_AMOUNT = 1_000_000_000_000n;
const MAX_BALANCE = 10_000_000_000_000n;
const idPattern = /^[a-zA-Z0-9:_-]{1,64}$/;

function assertId(value: string, label: string): void {
  if (typeof value !== 'string' || !idPattern.test(value)) {
    throw new DomainError('INVALID_IDENTIFIER', `Invalid ${label}.`);
  }
}
function assertAmount(amount: bigint): void {
  if (typeof amount !== 'bigint' || amount <= 0n || amount > MAX_AMOUNT) {
    throw new DomainError('INVALID_AMOUNT', 'Amount must be a bounded positive integer in minor units.');
  }
}

export class InMemoryRoleplay {
  readonly #characters = new Map<CharacterId, CharacterRecord>();
  readonly #balances = new Map<CharacterId, bigint>();
  readonly #history: LedgerEntry[] = [];
  readonly #requests = new Map<string, { fingerprint: string; entry: LedgerEntry }>();

  registerCharacter(principal: Principal, data: CharacterRecord): CharacterRecord {
    assertId(principal.accountId, 'account ID');
    assertId(data.id, 'character ID');
    assertId(data.accountId, 'account ID');
    if (principal.accountId !== data.accountId) {
      throw new DomainError('FORBIDDEN', 'A character may only be created for the authenticated account.');
    }
    const displayName = data.displayName.trim();
    if (displayName.length < 2 || displayName.length > 40 || /[\u0000-\u001f\u007f]/.test(displayName)) {
      throw new DomainError('INVALID_NAME', 'Character name must contain 2 to 40 printable characters.');
    }
    if (this.#characters.has(data.id)) {
      throw new DomainError('CHARACTER_EXISTS', 'Character ID is already registered.');
    }
    const character = Object.freeze({ id: data.id, accountId: data.accountId, displayName });
    this.#characters.set(data.id, character);
    this.#balances.set(data.id, 0n);
    return character;
  }

  getCharacter(id: CharacterId): CharacterRecord | undefined {
    return this.#characters.get(id);
  }

  getBalance(id: CharacterId): bigint {
    this.#requireCharacter(id);
    return this.#balances.get(id)!;
  }

  getLedger(): readonly LedgerEntry[] {
    return Object.freeze([...this.#history]);
  }

  grant(principal: Principal, command: GrantCommand): LedgerEntry {
    this.#requirePrincipal(principal);
    if (!principal.capabilities.includes('economy.grant')) {
      throw new DomainError('FORBIDDEN', 'A server-issued economy.grant capability is required.');
    }
    this.#validateMoneyCommand(command.requestId, command.amount);
    this.#requireCharacter(command.to);
    const fingerprint = `grant|${principal.accountId}|${command.to}|${command.amount}`;
    const previous = this.#previous(command.requestId, fingerprint);
    if (previous) return previous;
    this.#ensureWithinLimit(this.getBalance(command.to) + command.amount);
    return this.#record(command.requestId, fingerprint, 'grant', principal.accountId, null, command.to, command.amount);
  }

  transfer(principal: Principal, command: TransferCommand): LedgerEntry {
    this.#requirePrincipal(principal);
    this.#validateMoneyCommand(command.requestId, command.amount);
    const source = this.#requireCharacter(command.from);
    this.#requireCharacter(command.to);
    if (source.accountId !== principal.accountId) {
      throw new DomainError('FORBIDDEN', 'The sending character does not belong to this account.');
    }
    if (command.from === command.to) {
      throw new DomainError('SELF_TRANSFER', 'Source and destination must differ.');
    }
    const fingerprint = `transfer|${principal.accountId}|${command.from}|${command.to}|${command.amount}`;
    const previous = this.#previous(command.requestId, fingerprint);
    if (previous) return previous;
    if (this.getBalance(command.from) < command.amount) {
      throw new DomainError('INSUFFICIENT_FUNDS', 'Insufficient funds.');
    }
    this.#ensureWithinLimit(this.getBalance(command.to) + command.amount);
    return this.#record(command.requestId, fingerprint, 'transfer', principal.accountId, command.from, command.to, command.amount);
  }

  #requirePrincipal(principal: Principal): void {
    assertId(principal.accountId, 'principal account ID');
  }

  #requireCharacter(id: CharacterId): CharacterRecord {
    assertId(id, 'character ID');
    const character = this.#characters.get(id);
    if (!character) throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    return character;
  }

  #validateMoneyCommand(requestId: string, amount: bigint): void {
    assertId(requestId, 'request ID');
    assertAmount(amount);
  }

  #previous(requestId: string, fingerprint: string): LedgerEntry | undefined {
    const previous = this.#requests.get(requestId);
    if (previous && previous.fingerprint !== fingerprint) {
      throw new DomainError('IDEMPOTENCY_CONFLICT', 'A request ID cannot be reused with different arguments.');
    }
    return previous?.entry;
  }

  #ensureWithinLimit(balance: bigint): void {
    if (balance > MAX_BALANCE) throw new DomainError('BALANCE_LIMIT', 'Balance exceeds the allowed limit.');
  }

  #record(requestId: string, fingerprint: string, operation: LedgerEntry['operation'],
    performedBy: AccountId, from: CharacterId | null, to: CharacterId, amount: bigint): LedgerEntry {
    // This reference model is synchronous. A production adapter MUST perform these writes
    // in one durable, isolated PostgreSQL transaction with a unique idempotency constraint.
    if (from !== null) this.#balances.set(from, this.getBalance(from) - amount);
    this.#balances.set(to, this.getBalance(to) + amount);
    const entry = Object.freeze({
      sequence: this.#history.length + 1,
      requestId, operation, performedBy, from, to, amount,
    });
    this.#history.push(entry);
    this.#requests.set(requestId, { fingerprint, entry });
    return entry;
  }
}
