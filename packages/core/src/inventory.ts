import type { CharacterId } from './index.js';
import { DomainError } from './index.js';
import type { CharacterRecord, Principal } from './roleplay.js';

/**
 * A deterministic, single-process inventory reference. No network transport,
 * authentication, persistence, concurrency control or GTA VI integration.
 */
export interface ItemDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly weightGrams: number;
  readonly maxStack: number;
  readonly tradeable: boolean;
}

export interface InventoryStack {
  readonly itemId: string;
  readonly count: number;
}

export interface InventoryReceipt {
  readonly sequence: number;
  readonly requestId: string;
  readonly operation: 'mint' | 'consume' | 'transfer';
  readonly performedBy: string;
  readonly from: CharacterId | null;
  readonly to: CharacterId | null;
  readonly itemId: string;
  readonly count: number;
}

export interface MintItemCommand {
  readonly requestId: string;
  readonly to: CharacterId;
  readonly itemId: string;
  readonly count: number;
}

export interface ConsumeItemCommand {
  readonly requestId: string;
  readonly from: CharacterId;
  readonly itemId: string;
  readonly count: number;
}

export interface TransferItemCommand extends ConsumeItemCommand {
  readonly to: CharacterId;
}

const MAX_COUNT = 1_000;
const MAX_CAPACITY = 1_000_000;
const idPattern = /^[a-zA-Z0-9:_.-]{1,64}$/;

function assertId(value: string, label: string): void {
  if (typeof value !== 'string' || !idPattern.test(value)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid ' + label + '.');
  }
}

function assertPositiveCount(value: number, max: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 1 || value > max) {
    throw new DomainError('INVALID_QUANTITY', 'Invalid ' + label + '.');
  }
}

export class InMemoryInventory {
  readonly #items = new Map<string, ItemDefinition>();
  readonly #stocks = new Map<CharacterId, Map<string, number>>();
  readonly #history: InventoryReceipt[] = [];
  readonly #requests = new Map<string, { fingerprint: string; receipt: InventoryReceipt }>();

  public constructor(
    private readonly resolveCharacter: (
      id: CharacterId,
    ) => Pick<CharacterRecord, 'accountId'> | undefined,
    public readonly capacityGrams = 30_000,
  ) {
    assertPositiveCount(capacityGrams, MAX_CAPACITY, 'capacity');
  }

  registerItem(input: ItemDefinition): ItemDefinition {
    assertId(input.id, 'item ID');
    if (typeof input.displayName !== 'string') {
      throw new DomainError('INVALID_ITEM', 'Invalid item name.');
    }
    const displayName = input.displayName.trim();
    if (
      displayName.length < 2 ||
      displayName.length > 60 ||
      /[\u0000-\u001f\u007f]/.test(displayName) ||
      typeof input.tradeable !== 'boolean'
    ) {
      throw new DomainError('INVALID_ITEM', 'Invalid item definition.');
    }
    assertPositiveCount(input.weightGrams, 100_000, 'item weight');
    assertPositiveCount(input.maxStack, MAX_COUNT, 'maximum stack');
    if (this.#items.has(input.id)) {
      throw new DomainError('ITEM_EXISTS', 'Item ID already registered.');
    }
    const definition = Object.freeze({ ...input, displayName });
    this.#items.set(input.id, definition);
    return definition;
  }

  getCount(characterId: CharacterId, itemId: string): number {
    this.#character(characterId);
    this.#item(itemId);
    return this.#count(characterId, itemId);
  }

  getWeight(characterId: CharacterId): number {
    this.#character(characterId);
    const stock = this.#stocks.get(characterId);
    if (!stock) return 0;
    let total = 0;
    for (const [itemId, count] of stock) {
      total += this.#item(itemId).weightGrams * count;
    }
    return total;
  }

  list(characterId: CharacterId): readonly InventoryStack[] {
    this.#character(characterId);
    const stock = this.#stocks.get(characterId);
    const items = [...(stock?.entries() ?? [])]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([itemId, count]) => Object.freeze({ itemId, count }));
    return Object.freeze(items);
  }

  getLedger(): readonly InventoryReceipt[] {
    return Object.freeze([...this.#history]);
  }

  mint(principal: Principal, command: MintItemCommand): InventoryReceipt {
    if (!principal.capabilities.includes('inventory.mint')) {
      throw new DomainError('FORBIDDEN', 'Server-issued inventory.mint capability required.');
    }
    this.#validate(command.requestId, command.count);
    this.#character(command.to);
    const item = this.#item(command.itemId);
    const fingerprint = JSON.stringify([
      'mint',
      principal.accountId,
      command.to,
      item.id,
      command.count,
    ]);
    const previous = this.#previous(command.requestId, fingerprint);
    if (previous) return previous;
    this.#ensureFits(command.to, item, command.count);
    return this.#commit(command.requestId, fingerprint, 'mint', principal.accountId, null,
      command.to, item.id, command.count);
  }

  consume(principal: Principal, command: ConsumeItemCommand): InventoryReceipt {
    this.#validate(command.requestId, command.count);
    this.#owns(principal, command.from);
    const item = this.#item(command.itemId);
    const fingerprint = JSON.stringify([
      'consume',
      principal.accountId,
      command.from,
      item.id,
      command.count,
    ]);
    const previous = this.#previous(command.requestId, fingerprint);
    if (previous) return previous;
    this.#ensureHas(command.from, item.id, command.count);
    return this.#commit(command.requestId, fingerprint, 'consume', principal.accountId,
      command.from, null, item.id, command.count);
  }

  transfer(principal: Principal, command: TransferItemCommand): InventoryReceipt {
    this.#validate(command.requestId, command.count);
    this.#owns(principal, command.from);
    this.#character(command.to);
    const item = this.#item(command.itemId);
    if (command.from === command.to) {
      throw new DomainError('SELF_TRANSFER', 'Source and destination must differ.');
    }
    if (!item.tradeable) {
      throw new DomainError('NOT_TRADEABLE', 'Item cannot be transferred.');
    }
    const fingerprint = JSON.stringify([
      'transfer',
      principal.accountId,
      command.from,
      command.to,
      item.id,
      command.count,
    ]);
    const previous = this.#previous(command.requestId, fingerprint);
    if (previous) return previous;
    this.#ensureHas(command.from, item.id, command.count);
    this.#ensureFits(command.to, item, command.count);
    return this.#commit(command.requestId, fingerprint, 'transfer', principal.accountId,
      command.from, command.to, item.id, command.count);
  }

  #validate(requestId: string, count: number): void {
    assertId(requestId, 'request ID');
    assertPositiveCount(count, MAX_COUNT, 'quantity');
  }

  #character(id: CharacterId): Pick<CharacterRecord, 'accountId'> {
    assertId(id, 'character ID');
    const character = this.resolveCharacter(id);
    if (!character) throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    return character;
  }

  #owns(principal: Principal, id: CharacterId): void {
    assertId(principal.accountId, 'principal account ID');
    if (this.#character(id).accountId !== principal.accountId) {
      throw new DomainError('FORBIDDEN', 'Character does not belong to this account.');
    }
  }

  #item(id: string): ItemDefinition {
    assertId(id, 'item ID');
    const item = this.#items.get(id);
    if (!item) throw new DomainError('ITEM_NOT_FOUND', 'Unknown item.');
    return item;
  }

  #count(owner: CharacterId, itemId: string): number {
    return this.#stocks.get(owner)?.get(itemId) ?? 0;
  }

  #ensureHas(owner: CharacterId, itemId: string, count: number): void {
    if (this.#count(owner, itemId) < count) {
      throw new DomainError('INSUFFICIENT_ITEMS', 'Not enough items.');
    }
  }

  #ensureFits(owner: CharacterId, item: ItemDefinition, count: number): void {
    if (this.#count(owner, item.id) + count > item.maxStack) {
      throw new DomainError('STACK_LIMIT', 'Item stack limit exceeded.');
    }
    if (this.getWeight(owner) + item.weightGrams * count > this.capacityGrams) {
      throw new DomainError('CAPACITY_LIMIT', 'Inventory capacity exceeded.');
    }
  }

  #previous(requestId: string, fingerprint: string): InventoryReceipt | undefined {
    const previous = this.#requests.get(requestId);
    if (previous && previous.fingerprint !== fingerprint) {
      throw new DomainError('IDEMPOTENCY_CONFLICT', 'Request ID reused with different arguments.');
    }
    return previous?.receipt;
  }

  #setCount(owner: CharacterId, itemId: string, count: number): void {
    let stock = this.#stocks.get(owner);
    if (!stock) {
      stock = new Map<string, number>();
      this.#stocks.set(owner, stock);
    }
    if (count === 0) stock.delete(itemId);
    else stock.set(itemId, count);
  }

  #commit(
    requestId: string,
    fingerprint: string,
    operation: InventoryReceipt['operation'],
    performedBy: string,
    from: CharacterId | null,
    to: CharacterId | null,
    itemId: string,
    count: number,
  ): InventoryReceipt {
    // All constraints have been checked above. A production port MUST atomically
    // persist stock changes, audit entry and idempotency key in one SQL transaction.
    if (from !== null) this.#setCount(from, itemId, this.#count(from, itemId) - count);
    if (to !== null) this.#setCount(to, itemId, this.#count(to, itemId) + count);
    const receipt = Object.freeze({
      sequence: this.#history.length + 1,
      requestId,
      operation,
      performedBy,
      from,
      to,
      itemId,
      count,
    });
    this.#history.push(receipt);
    this.#requests.set(requestId, { fingerprint, receipt });
    return receipt;
  }
}
