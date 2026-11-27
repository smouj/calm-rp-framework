import { DomainError, requireUuid } from './index.js';
import type { CharacterOwnershipDirectory } from './ledger.js';
import { nodeHashSource } from './sessions.js';
import type { HashSource, SessionPrincipal } from './sessions.js';
import type {
  ConsumePersistentInventoryCommand,
  MintPersistentInventoryCommand,
  MovePersistentInventoryCommand,
  PersistInventoryOperation,
  PersistentInventoryCommandBase,
  PersistentInventoryMetadata,
  PersistentInventoryMetadataValue,
  PersistentInventoryMovement,
  PersistentInventoryReceipt,
  PersistentInventoryStore,
  TransferPersistentInventoryCommand,
} from './persistent-inventory.js';
import type { Uuid } from './ids.js';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9:_-]{1,128}$/;
const ITEM_ID_PATTERN = /^[A-Za-z0-9:_.-]{1,64}$/;
const MAX_QUANTITY = 1_000;
const MAX_METADATA_BYTES = 4_096;
const MAX_METADATA_DEPTH = 8;
const MAX_METADATA_ITEMS = 128;

function requirePrincipal(principal: SessionPrincipal): Uuid {
  if (
    typeof principal !== 'object' ||
    principal === null ||
    !Array.isArray(principal.capabilities)
  ) {
    throw new DomainError('FORBIDDEN', 'An authenticated server session is required.');
  }
  return requireUuid(principal.accountId, 'principal account ID');
}

function requireRequest(command: PersistentInventoryCommandBase): {
  readonly requestId: string;
  readonly itemId: string;
  readonly quantity: number;
  readonly metadata: PersistentInventoryMetadata;
} {
  if (typeof command.requestId !== 'string' || !REQUEST_ID_PATTERN.test(command.requestId)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory request ID.');
  }
  if (typeof command.itemId !== 'string' || !ITEM_ID_PATTERN.test(command.itemId)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory item ID.');
  }
  if (
    !Number.isSafeInteger(command.quantity) ||
    command.quantity < 1 ||
    command.quantity > MAX_QUANTITY
  ) {
    throw new DomainError('INVALID_QUANTITY', 'Inventory quantity must be between 1 and 1000.');
  }
  const metadata = normalizeMetadata(command.metadata);
  return {
    requestId: command.requestId,
    itemId: command.itemId,
    quantity: command.quantity,
    metadata,
  };
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeMetadataValue(value: unknown, depth: number): PersistentInventoryMetadataValue {
  if (depth > MAX_METADATA_DEPTH) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata is nested too deeply.');
  }
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (Buffer.byteLength(value, 'utf8') > MAX_METADATA_BYTES) {
      throw new DomainError('INVALID_METADATA', 'An inventory metadata string is too large.');
    }
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new DomainError('INVALID_METADATA', 'Inventory metadata numbers must be finite.');
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_METADATA_ITEMS) {
      throw new DomainError('INVALID_METADATA', 'An inventory metadata list has too many values.');
    }
    return Object.freeze(value.map((entry) => normalizeMetadataValue(entry, depth + 1)));
  }
  if (!isPlainRecord(value)) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata must be plain JSON data.');
  }

  const keys = Object.keys(value).sort();
  if (keys.length > MAX_METADATA_ITEMS) {
    throw new DomainError('INVALID_METADATA', 'An inventory metadata object has too many keys.');
  }
  const entries: [string, PersistentInventoryMetadataValue][] = [];
  for (const key of keys) {
    if (key.length === 0 || key.length > 128 || /[\u0000-\u001f\u007f]/.test(key)) {
      throw new DomainError('INVALID_METADATA', 'Inventory metadata contains an invalid key.');
    }
    entries.push([key, normalizeMetadataValue(value[key], depth + 1)]);
  }
  return Object.freeze(Object.fromEntries(entries)) as {
    readonly [key: string]: PersistentInventoryMetadataValue;
  };
}

function normalizeMetadata(value: unknown): PersistentInventoryMetadata {
  const normalized = normalizeMetadataValue(value === undefined ? {} : value, 0);
  if (!isPlainRecord(normalized)) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata must be a JSON object.');
  }
  if (
    Buffer.byteLength(stableJson(normalized as PersistentInventoryMetadata), 'utf8') >
    MAX_METADATA_BYTES
  ) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata exceeds 4 KiB.');
  }
  return normalized as PersistentInventoryMetadata;
}

function stableJson(value: PersistentInventoryMetadataValue): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isPlainRecord(value)) {
    const entries = Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableJson(value[key] as PersistentInventoryMetadataValue)}`,
      );
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

function requireCapability(principal: SessionPrincipal, capability: 'inventory.mint'): void {
  if (!principal.capabilities.includes(capability)) {
    throw new DomainError('FORBIDDEN', `A server-issued ${capability} capability is required.`);
  }
}

function requireContainerId(value: string, label: string): Uuid {
  return requireUuid(value, label);
}

/**
 * Authenticated persistent inventory operations for CALM's GTA VI RP domain.
 * The service accepts only server-resolved session principals. Character IDs
 * in commands are selections, not identity claims: every one is checked
 * against the authenticated account before a write is passed to storage.
 */
export class PersistentInventoryService {
  readonly #store: PersistentInventoryStore;
  readonly #characters: CharacterOwnershipDirectory;
  readonly #hashing: HashSource;

  public constructor(
    store: PersistentInventoryStore,
    characters: CharacterOwnershipDirectory,
    options: { hashing?: HashSource } = {},
  ) {
    this.#store = store;
    this.#characters = characters;
    this.#hashing = options.hashing ?? nodeHashSource;
  }

  public async mint(
    principal: SessionPrincipal,
    command: MintPersistentInventoryCommand,
  ): Promise<PersistentInventoryReceipt> {
    const accountId = requirePrincipal(principal);
    requireCapability(principal, 'inventory.mint');
    const request = requireRequest(command);
    const toContainerId = requireContainerId(command.toContainerId, 'destination container ID');
    const toCharacterId = requireUuid(command.toCharacterId, 'destination character ID');
    const actorCharacterId =
      command.actorCharacterId === undefined || command.actorCharacterId === null
        ? null
        : requireUuid(command.actorCharacterId, 'actor character ID');
    if (actorCharacterId !== null) await this.#requireOwnCharacter(accountId, actorCharacterId);
    await this.#requireExistingCharacter(toCharacterId);

    const destination = await this.#requireContainer(toContainerId);
    await this.#requireExistingCharacter(destination.ownerCharacterId);
    const movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'> = {
      operation: 'mint',
      itemId: request.itemId,
      sourceContainerId: null,
      destinationContainerId: toContainerId,
      sourceOwnerCharacterId: null,
      destinationOwnerCharacterId: toCharacterId,
      quantity: request.quantity,
      metadata: request.metadata,
    };
    return this.#apply({
      accountId,
      actorCharacterId,
      requestId: request.requestId,
      movement,
      authorizedContainerOwnerCharacterIds: [destination.ownerCharacterId],
      fingerprintValues: ['mint', accountId, actorCharacterId, toCharacterId],
    });
  }

  public async consume(
    principal: SessionPrincipal,
    command: ConsumePersistentInventoryCommand,
  ): Promise<PersistentInventoryReceipt> {
    const accountId = requirePrincipal(principal);
    const request = requireRequest(command);
    const actorCharacterId = requireUuid(command.actorCharacterId, 'actor character ID');
    const fromContainerId = requireContainerId(command.fromContainerId, 'source container ID');
    await this.#requireOwnCharacter(accountId, actorCharacterId);
    const source = await this.#requireAccessibleContainer(accountId, fromContainerId);
    const movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'> = {
      operation: 'consume',
      itemId: request.itemId,
      sourceContainerId: fromContainerId,
      destinationContainerId: null,
      sourceOwnerCharacterId: actorCharacterId,
      destinationOwnerCharacterId: null,
      quantity: request.quantity,
      metadata: request.metadata,
    };
    return this.#apply({
      accountId,
      actorCharacterId,
      requestId: request.requestId,
      movement,
      authorizedContainerOwnerCharacterIds: [source.ownerCharacterId],
      fingerprintValues: ['consume', accountId, actorCharacterId],
    });
  }

  public async move(
    principal: SessionPrincipal,
    command: MovePersistentInventoryCommand,
  ): Promise<PersistentInventoryReceipt> {
    const accountId = requirePrincipal(principal);
    const request = requireRequest(command);
    const actorCharacterId = requireUuid(command.actorCharacterId, 'actor character ID');
    const fromContainerId = requireContainerId(command.fromContainerId, 'source container ID');
    const toContainerId = requireContainerId(command.toContainerId, 'destination container ID');
    if (fromContainerId === toContainerId) {
      throw new DomainError('SAME_CONTAINER', 'Source and destination containers must differ.');
    }
    await this.#requireOwnCharacter(accountId, actorCharacterId);
    const [source, destination] = await Promise.all([
      this.#requireAccessibleContainer(accountId, fromContainerId),
      this.#requireAccessibleContainer(accountId, toContainerId),
    ]);
    const movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'> = {
      operation: 'move',
      itemId: request.itemId,
      sourceContainerId: fromContainerId,
      destinationContainerId: toContainerId,
      sourceOwnerCharacterId: actorCharacterId,
      destinationOwnerCharacterId: actorCharacterId,
      quantity: request.quantity,
      metadata: request.metadata,
    };
    return this.#apply({
      accountId,
      actorCharacterId,
      requestId: request.requestId,
      movement,
      authorizedContainerOwnerCharacterIds: [source.ownerCharacterId, destination.ownerCharacterId],
      fingerprintValues: ['move', accountId, actorCharacterId],
    });
  }

  public async transfer(
    principal: SessionPrincipal,
    command: TransferPersistentInventoryCommand,
  ): Promise<PersistentInventoryReceipt> {
    const accountId = requirePrincipal(principal);
    const request = requireRequest(command);
    const actorCharacterId = requireUuid(command.actorCharacterId, 'actor character ID');
    const fromContainerId = requireContainerId(command.fromContainerId, 'source container ID');
    const toContainerId = requireContainerId(command.toContainerId, 'destination container ID');
    const toCharacterId = requireUuid(command.toCharacterId, 'recipient character ID');
    if (actorCharacterId === toCharacterId) {
      throw new DomainError('SELF_TRANSFER', 'Source and recipient characters must differ.');
    }
    if (fromContainerId === toContainerId) {
      throw new DomainError('SAME_CONTAINER', 'Source and destination containers must differ.');
    }
    await this.#requireOwnCharacter(accountId, actorCharacterId);
    await this.#requireExistingCharacter(toCharacterId);
    const [source, destination] = await Promise.all([
      this.#requireAccessibleContainer(accountId, fromContainerId),
      this.#requireContainer(toContainerId),
    ]);
    if (destination.ownerCharacterId !== toCharacterId) {
      throw new DomainError(
        'FORBIDDEN',
        'A trade may deposit only into a container owned by the recipient character.',
      );
    }
    const movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'> = {
      operation: 'transfer',
      itemId: request.itemId,
      sourceContainerId: fromContainerId,
      destinationContainerId: toContainerId,
      sourceOwnerCharacterId: actorCharacterId,
      destinationOwnerCharacterId: toCharacterId,
      quantity: request.quantity,
      metadata: request.metadata,
    };
    return this.#apply({
      accountId,
      actorCharacterId,
      requestId: request.requestId,
      movement,
      authorizedContainerOwnerCharacterIds: [source.ownerCharacterId, destination.ownerCharacterId],
      fingerprintValues: ['transfer', accountId, actorCharacterId, toCharacterId],
    });
  }

  async #apply(input: {
    readonly accountId: Uuid;
    readonly actorCharacterId: Uuid | null;
    readonly requestId: string;
    readonly movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'>;
    readonly authorizedContainerOwnerCharacterIds: readonly Uuid[];
    readonly fingerprintValues: readonly PersistentInventoryMetadataValue[];
  }): Promise<PersistentInventoryReceipt> {
    const canonicalCommand = stableJson({
      requestId: input.requestId,
      itemId: input.movement.itemId,
      quantity: input.movement.quantity,
      metadata: input.movement.metadata,
      sourceContainerId: input.movement.sourceContainerId,
      destinationContainerId: input.movement.destinationContainerId,
      sourceOwnerCharacterId: input.movement.sourceOwnerCharacterId,
      destinationOwnerCharacterId: input.movement.destinationOwnerCharacterId,
      fingerprintValues: input.fingerprintValues,
    });
    const fingerprint = this.#hashing.sha256Hex(canonicalCommand).toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(fingerprint)) {
      throw new DomainError(
        'HASH_FAILURE',
        'Inventory fingerprint source returned an invalid SHA-256 value.',
      );
    }
    const operation: PersistInventoryOperation = {
      idempotencyKey: input.requestId,
      commandFingerprint: fingerprint,
      operation: input.movement.operation,
      actorAccountId: input.accountId,
      actorCharacterId: input.actorCharacterId,
      authorizedContainerOwnerCharacterIds: Object.freeze([
        ...new Set(input.authorizedContainerOwnerCharacterIds),
      ]),
      movement: input.movement,
    };
    return this.#store.apply(operation);
  }

  async #requireOwnCharacter(accountId: Uuid, characterId: Uuid): Promise<void> {
    const owner = await this.#characters.findOwnerAccount(characterId);
    if (owner === null) throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    if (owner !== accountId) {
      throw new DomainError('FORBIDDEN', 'Character does not belong to the authenticated account.');
    }
  }

  async #requireExistingCharacter(characterId: Uuid): Promise<void> {
    if ((await this.#characters.findOwnerAccount(characterId)) === null) {
      throw new DomainError('CHARACTER_NOT_FOUND', 'Unknown character.');
    }
  }

  async #requireContainer(containerId: Uuid) {
    const container = await this.#store.getContainer(containerId);
    if (container === null)
      throw new DomainError('CONTAINER_NOT_FOUND', 'Unknown inventory container.');
    return container;
  }

  async #requireAccessibleContainer(accountId: Uuid, containerId: Uuid) {
    const container = await this.#requireContainer(containerId);
    await this.#requireOwnCharacter(accountId, container.ownerCharacterId);
    return container;
  }
}
