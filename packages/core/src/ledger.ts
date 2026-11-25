import { DomainError, newUuid, requireUuid } from './index.js';
import type { SessionPrincipal, Uuid } from './index.js';

/** Financial account kinds, mirroring the database CHECK constraint. */
export type FinancialAccountKind = 'cash' | 'bank' | 'business' | 'escrow';

export interface FinancialAccount {
  readonly id: Uuid;
  readonly ownerCharacterId: Uuid;
  readonly kind: FinancialAccountKind;
}

/** One signed leg of a double-entry transaction. Debit is negative. */
export interface LedgerLeg {
  readonly financialAccountId: Uuid;
  readonly amountMinor: bigint;
}

export interface PostTransactionCommand {
  readonly idempotencyKey: string;
  /** Canonical description of the operation; a reused key with a different fingerprint is a conflict. */
  readonly fingerprint: string;
  readonly reference: string | null;
  readonly legs: readonly LedgerLeg[];
}

export interface PostedTransaction {
  readonly transactionId: Uuid;
  readonly idempotencyKey: string;
  /** `false` when this call was a replay of an identical earlier command. */
  readonly posted: boolean;
  readonly legs: readonly LedgerLeg[];
  readonly createdAt: Date;
}

export interface LedgerEntryLine {
  readonly transactionId: Uuid;
  readonly idempotencyKey: string;
  readonly amountMinor: bigint;
  readonly createdAt: Date;
}

export interface FinancialAccountStore {
  /** Idempotently provision one account of a kind for a character. */
  ensureAccount(ownerCharacterId: Uuid, kind: FinancialAccountKind): Promise<FinancialAccount>;
  findAccountByOwner(
    ownerCharacterId: Uuid,
    kind: FinancialAccountKind,
  ): Promise<FinancialAccount | null>;
  /** The reserved system treasury that grant legs debit from. */
  treasuryAccount(): Promise<FinancialAccount>;
}

export interface LedgerStore {
  /**
   * Post one balanced transaction atomically and durably:
   * - the idempotency key is unique; a replay of an identical command returns
   *   the original receipt with `posted: false`;
   * - a reused key with a different fingerprint is an `IDEMPOTENCY_CONFLICT`
   *   and writes nothing;
   * - legs whose sums would drive any account negative fail with
   *   `INSUFFICIENT_FUNDS` and roll back entirely;
   * - legs that do not sum to zero fail with `UNBALANCED_TRANSACTION`.
   */
  post(command: PostTransactionCommand): Promise<PostedTransaction>;
  /** Balance of one account, derived from the sum of its entries. */
  getBalance(financialAccountId: Uuid): Promise<bigint>;
  /** Newest-first entries of one account. */
  listAccountEntries(financialAccountId: Uuid, limit: number): Promise<readonly LedgerEntryLine[]>;
}

/** Minimal ownership lookup the ledger needs from the character module. */
export interface CharacterOwnershipDirectory {
  findOwnerAccount(characterId: Uuid): Promise<Uuid | null>;
}

export interface GrantMoneyCommand {
  readonly requestId: string;
  readonly toCharacterId: Uuid;
  readonly amountMinor: bigint;
}

export interface TransferMoneyCommand {
  readonly requestId: string;
  readonly fromCharacterId: Uuid;
  readonly toCharacterId: Uuid;
  readonly amountMinor: bigint;
}

export interface TransferReceipt {
  readonly transactionId: Uuid;
  readonly requestId: string;
  readonly posted: boolean;
}

const MAX_AMOUNT = 1_000_000_000_000n;
const MAX_BALANCE = 10_000_000_000_000n;
const requestIdPattern = /^[a-zA-Z0-9:_-]{1,64}$/;

function assertRequestId(requestId: string): void {
  if (typeof requestId !== 'string' || !requestIdPattern.test(requestId)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid request ID.');
  }
}

function assertAmount(amountMinor: bigint): void {
  if (typeof amountMinor !== 'bigint' || amountMinor <= 0n || amountMinor > MAX_AMOUNT) {
    throw new DomainError(
      'INVALID_AMOUNT',
      'Amount must be a bounded positive integer in minor units.',
    );
  }
}

function requireCapability(principal: SessionPrincipal, capability: 'economy.grant'): void {
  const accountId = requireUuid(principal.accountId, 'principal account ID');
  if (!principal.capabilities.includes(capability)) {
    throw new DomainError(
      'FORBIDDEN',
      `A server-issued ${capability} capability is required (account ${accountId}).`,
    );
  }
}

function validateLegs(legs: readonly LedgerLeg[]): void {
  if (legs.length < 2) {
    throw new DomainError('UNBALANCED_TRANSACTION', 'A transaction needs at least two legs.');
  }
  let total = 0n;
  const seen = new Set<Uuid>();
  for (const leg of legs) {
    requireUuid(leg.financialAccountId, 'financial account ID');
    if (leg.amountMinor === 0n) {
      throw new DomainError('UNBALANCED_TRANSACTION', 'A leg amount may never be zero.');
    }
    if (seen.has(leg.financialAccountId)) {
      throw new DomainError('UNBALANCED_TRANSACTION', 'One leg per financial account.');
    }
    seen.add(leg.financialAccountId);
    total += leg.amountMinor;
  }
  if (total !== 0n) {
    throw new DomainError(
      'UNBALANCED_TRANSACTION',
      `Transaction legs must sum to zero, got ${total}.`,
    );
  }
}

/**
 * Double-entry ledger application service.
 *
 * Money exists only as ledger legs: a grant debits the reserved treasury and
 * credits the destination; a transfer debits the sender's cash account and
 * credits the recipient's. Every posting is one atomic, idempotent,
 * balanced transaction, and balances are always the sum of the entries —
 * there is no mutable balance column to drift.
 */
export class LedgerService {
  readonly #accounts: FinancialAccountStore;
  readonly #ledger: LedgerStore;
  readonly #characters: CharacterOwnershipDirectory;

  public constructor(
    accounts: FinancialAccountStore,
    ledger: LedgerStore,
    characters: CharacterOwnershipDirectory,
  ) {
    this.#accounts = accounts;
    this.#ledger = ledger;
    this.#characters = characters;
  }

  public async grant(
    principal: SessionPrincipal,
    command: GrantMoneyCommand,
  ): Promise<TransferReceipt> {
    requireCapability(principal, 'economy.grant');
    assertRequestId(command.requestId);
    const toCharacterId = requireUuid(command.toCharacterId, 'destination character ID');
    assertAmount(command.amountMinor);

    const destination = await this.#requireCashAccount(toCharacterId);
    const treasury = await this.#accounts.treasuryAccount();
    await this.#ensureWithinLimit(destination.id, command.amountMinor);

    const posted = await this.#ledger.post({
      idempotencyKey: command.requestId,
      fingerprint: `grant|to:${toCharacterId}|amount:${command.amountMinor}`,
      reference: null,
      legs: [
        { financialAccountId: treasury.id, amountMinor: -command.amountMinor },
        { financialAccountId: destination.id, amountMinor: command.amountMinor },
      ],
    });
    return {
      transactionId: posted.transactionId,
      requestId: command.requestId,
      posted: posted.posted,
    };
  }

  public async transfer(
    principal: SessionPrincipal,
    command: TransferMoneyCommand,
  ): Promise<TransferReceipt> {
    assertRequestId(command.requestId);
    const fromCharacterId = requireUuid(command.fromCharacterId, 'sending character ID');
    const toCharacterId = requireUuid(command.toCharacterId, 'destination character ID');
    assertAmount(command.amountMinor);
    if (fromCharacterId === toCharacterId) {
      throw new DomainError('SELF_TRANSFER', 'Source and destination must differ.');
    }

    const sender = await this.#requireCashAccount(fromCharacterId);
    const recipient = await this.#requireCashAccount(toCharacterId);

    const ownerAccount = await this.#characters.findOwnerAccount(fromCharacterId);
    if (ownerAccount === null) {
      throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown sending character.');
    }
    if (ownerAccount !== requireUuid(principal.accountId, 'principal account ID')) {
      throw new DomainError(
        'FORBIDDEN',
        'The sending character does not belong to the authenticated account.',
      );
    }
    if ((await this.#ledger.getBalance(sender.id)) < command.amountMinor) {
      throw new DomainError('INSUFFICIENT_FUNDS', 'Insufficient funds.');
    }
    await this.#ensureWithinLimit(recipient.id, command.amountMinor);

    const posted = await this.#ledger.post({
      idempotencyKey: command.requestId,
      fingerprint: `transfer|from:${fromCharacterId}|to:${toCharacterId}|amount:${command.amountMinor}`,
      reference: null,
      legs: [
        { financialAccountId: sender.id, amountMinor: -command.amountMinor },
        { financialAccountId: recipient.id, amountMinor: command.amountMinor },
      ],
    });
    return {
      transactionId: posted.transactionId,
      requestId: command.requestId,
      posted: posted.posted,
    };
  }

  /** The character's cash balance, in minor units. */
  public async getCharacterBalance(characterId: Uuid): Promise<bigint> {
    const account = await this.#requireCashAccount(characterId);
    return this.#ledger.getBalance(account.id);
  }

  /** Newest-first entries on the character's cash account. */
  public async getCharacterStatement(
    characterId: Uuid,
    limit: number,
  ): Promise<readonly LedgerEntryLine[]> {
    const account = await this.#requireCashAccount(characterId);
    return this.#ledger.listAccountEntries(account.id, limit);
  }

  async #requireCashAccount(characterId: Uuid): Promise<FinancialAccount> {
    // The character must exist before any financial account is provisioned;
    // this check runs in the domain so both stores share one semantics.
    const owner = await this.#characters.findOwnerAccount(characterId);
    if (owner === null) {
      throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    }
    return this.#accounts.ensureAccount(characterId, 'cash');
  }

  async #ensureWithinLimit(accountId: Uuid, amountMinor: bigint): Promise<void> {
    const balance = await this.#ledger.getBalance(accountId);
    if (balance + amountMinor > MAX_BALANCE) {
      throw new DomainError('BALANCE_LIMIT', 'Balance exceeds the allowed limit.');
    }
  }
}

const TREASURY_ACCOUNT_ID = '00000000-0000-4000-8000-0000000000f3' as Uuid;
const TREASURY_CHARACTER_ID = '00000000-0000-4000-8000-0000000000f2' as Uuid;

/**
 * The reserved treasury is the money-supply source that grants debit from;
 * unlike character accounts it may carry a negative balance, so the
 * never-negative invariant exempts exactly this one reserved id.
 */
export const RESERVED_TREASURY_ACCOUNT_ID = TREASURY_ACCOUNT_ID;

/**
 * Deterministic in-memory double-entry ledger for the simulator and unit
 * tests. It mirrors the SQL semantics exactly: entries are the only state,
 * balances are their sum, posting validates the same invariants the database
 * trigger and transaction enforce.
 */
export class InMemoryFinancialAccountStore implements FinancialAccountStore {
  readonly #accounts = new Map<Uuid, FinancialAccount>();
  readonly #byOwnerKind = new Map<string, FinancialAccount>();

  public async ensureAccount(
    ownerCharacterId: Uuid,
    kind: FinancialAccountKind,
  ): Promise<FinancialAccount> {
    const key = `${ownerCharacterId}|${kind}`;
    const existing = this.#byOwnerKind.get(key);
    if (existing) return existing;
    const account: FinancialAccount = {
      id: newUuid(),
      ownerCharacterId: requireUuid(ownerCharacterId, 'owner character ID'),
      kind,
    };
    this.#accounts.set(account.id, account);
    this.#byOwnerKind.set(key, account);
    return account;
  }

  public async findAccountByOwner(
    ownerCharacterId: Uuid,
    kind: FinancialAccountKind,
  ): Promise<FinancialAccount | null> {
    return this.#byOwnerKind.get(`${ownerCharacterId}|${kind}`) ?? null;
  }

  public async treasuryAccount(): Promise<FinancialAccount> {
    const treasury = await this.findAccountByOwner(TREASURY_CHARACTER_ID, 'bank');
    if (treasury) return treasury;
    const account: FinancialAccount = {
      id: TREASURY_ACCOUNT_ID,
      ownerCharacterId: TREASURY_CHARACTER_ID,
      kind: 'bank',
    };
    this.#accounts.set(account.id, account);
    this.#byOwnerKind.set(`${TREASURY_CHARACTER_ID}|bank`, account);
    return account;
  }
}

interface StoredEntry {
  readonly transactionId: Uuid;
  readonly financialAccountId: Uuid;
  readonly amountMinor: bigint;
  readonly createdAt: Date;
}

interface StoredTransaction {
  readonly transactionId: Uuid;
  readonly idempotencyKey: string;
  readonly fingerprint: string;
  readonly entries: readonly StoredEntry[];
}

export class InMemoryLedgerStore implements LedgerStore {
  readonly #transactions = new Map<string, StoredTransaction>();
  readonly #byTransactionId = new Map<Uuid, StoredTransaction>();
  readonly #entries: StoredEntry[] = [];

  public async post(command: PostTransactionCommand): Promise<PostedTransaction> {
    assertRequestId(command.idempotencyKey);
    validateLegs(command.legs);

    const previous = this.#transactions.get(command.idempotencyKey);
    if (previous) {
      if (previous.fingerprint !== command.fingerprint) {
        throw new DomainError(
          'IDEMPOTENCY_CONFLICT',
          'A request ID cannot be reused with different arguments.',
        );
      }
      return this.#receiptOf(previous, false);
    }

    const transactionId = newUuid();
    const createdAt = new Date();
    const entries: StoredEntry[] = command.legs.map((leg) => ({
      transactionId,
      financialAccountId: leg.financialAccountId,
      amountMinor: leg.amountMinor,
      createdAt,
    }));

    for (const entry of entries) {
      if (entry.financialAccountId === TREASURY_ACCOUNT_ID) continue;
      const nextBalance = this.#sumBalance(entry.financialAccountId) + entry.amountMinor;
      if (nextBalance < 0n) {
        throw new DomainError('INSUFFICIENT_FUNDS', 'Insufficient funds.');
      }
      if (nextBalance > MAX_BALANCE) {
        throw new DomainError('BALANCE_LIMIT', 'Balance exceeds the allowed limit.');
      }
    }

    const stored: StoredTransaction = {
      transactionId,
      idempotencyKey: command.idempotencyKey,
      fingerprint: command.fingerprint,
      entries,
    };
    this.#transactions.set(command.idempotencyKey, stored);
    this.#byTransactionId.set(transactionId, stored);
    this.#entries.push(...entries);
    return this.#receiptOf(stored, true);
  }

  public async getBalance(financialAccountId: Uuid): Promise<bigint> {
    return this.#sumBalance(requireUuid(financialAccountId, 'financial account ID'));
  }

  public async listAccountEntries(
    financialAccountId: Uuid,
    limit: number,
  ): Promise<readonly LedgerEntryLine[]> {
    const accountId = requireUuid(financialAccountId, 'financial account ID');
    return Object.freeze(
      this.#entries
        .filter((entry) => entry.financialAccountId === accountId)
        .slice(-limit)
        .reverse()
        .map((entry) => ({
          transactionId: entry.transactionId,
          idempotencyKey:
            this.#byTransactionId.get(entry.transactionId)?.idempotencyKey ?? 'unknown',
          amountMinor: entry.amountMinor,
          createdAt: entry.createdAt,
        })),
    );
  }

  #sumBalance(accountId: Uuid): bigint {
    let total = 0n;
    for (const entry of this.#entries) {
      if (entry.financialAccountId === accountId) total += entry.amountMinor;
    }
    return total;
  }

  #receiptOf(stored: StoredTransaction, posted: boolean): PostedTransaction {
    return {
      transactionId: stored.transactionId,
      idempotencyKey: stored.idempotencyKey,
      posted,
      legs: Object.freeze(
        stored.entries.map((entry) => ({
          financialAccountId: entry.financialAccountId,
          amountMinor: entry.amountMinor,
        })),
      ),
      createdAt: stored.entries[0]?.createdAt ?? new Date(),
    };
  }
}
