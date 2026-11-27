import { DomainError, newUuid, requireUuid } from '@gta6-rp/core';
import type {
  CreatePersistentInventoryContainer,
  PersistInventoryOperation,
  PersistentInventoryContainer,
  PersistentInventoryContainerKind,
  PersistentInventoryItemDefinition,
  PersistentInventoryMetadata,
  PersistentInventoryMetadataValue,
  PersistentInventoryMovement,
  PersistentInventoryOperationKind,
  PersistentInventoryReceipt,
  PersistentInventoryStack,
  PersistentInventoryStore,
  Uuid,
} from '@gta6-rp/core';

import { isForeignKeyViolation, isUniqueViolation } from './sql.js';
import { readTimestamp, type SqlExecutor, type SqlSession } from './sql.js';

const ITEM_ID_PATTERN = /^[A-Za-z0-9:_.-]{1,64}$/;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9:_-]{1,128}$/;
const FINGERPRINT_PATTERN = /^[0-9a-f]{64}$/;
const MAX_QUANTITY = 1_000;
const CONTAINER_KINDS: readonly PersistentInventoryContainerKind[] = [
  'character',
  'vehicle',
  'property',
  'warehouse',
];
const OPERATION_KINDS: readonly PersistentInventoryOperationKind[] = [
  'mint',
  'consume',
  'move',
  'transfer',
];

interface InventoryContainerRow {
  readonly id: Uuid;
  readonly kind: PersistentInventoryContainerKind;
  readonly locationId: Uuid;
  readonly ownerCharacterId: Uuid;
  readonly slotCapacity: number;
  readonly weightCapacityGrams: number;
  readonly createdAt: Date;
}

type InventoryStackRow = PersistentInventoryStack;

function readInteger(row: Record<string, unknown>, column: string): number {
  const value = row[column];
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isSafeInteger(parsed)) {
    throw new DomainError('INVENTORY_CORRUPT', `Stored ${column} is not a safe integer.`);
  }
  return parsed;
}

function readNullableUuid(row: Record<string, unknown>, column: string): Uuid | null {
  const value = row[column];
  return value === null || value === undefined ? null : (String(value) as Uuid);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function freezeMetadataValue(value: unknown, depth = 0): PersistentInventoryMetadataValue {
  if (depth > 32)
    throw new DomainError('INVENTORY_CORRUPT', 'Stored metadata is too deeply nested.');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => freezeMetadataValue(entry, depth + 1)));
  }
  if (!isPlainRecord(value)) {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored metadata is not a JSON object.');
  }
  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, freezeMetadataValue(entry, depth + 1)]),
  );
  return Object.freeze(normalized) as { readonly [key: string]: PersistentInventoryMetadataValue };
}

function readMetadata(
  row: Record<string, unknown>,
  column = 'metadata_json',
): PersistentInventoryMetadata {
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(row[column]));
  } catch {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored inventory metadata is not valid JSON.');
  }
  if (!isPlainRecord(parsed)) {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored inventory metadata must be a JSON object.');
  }
  if (Buffer.byteLength(JSON.stringify(parsed), 'utf8') > 4_096) {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored inventory metadata exceeds 4 KiB.');
  }
  return freezeMetadataValue(parsed) as PersistentInventoryMetadata;
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
  return JSON.stringify(value) ?? 'null';
}

function itemDefinitionFromRow(row: Record<string, unknown>): PersistentInventoryItemDefinition {
  return Object.freeze({
    id: String(row['id']),
    displayName: String(row['display_name']),
    weightGrams: readInteger(row, 'weight_grams'),
    maxStack: readInteger(row, 'max_stack'),
    tradeable: row['tradeable'] === true,
  });
}

function containerFromRow(row: Record<string, unknown>): InventoryContainerRow {
  const kind = String(row['kind']) as PersistentInventoryContainerKind;
  if (!CONTAINER_KINDS.includes(kind)) {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored inventory container kind is unknown.');
  }
  return Object.freeze({
    id: String(row['id']) as Uuid,
    kind,
    locationId: String(row['location_id']) as Uuid,
    ownerCharacterId: String(row['owner_character_id']) as Uuid,
    slotCapacity: readInteger(row, 'slot_capacity'),
    weightCapacityGrams: readInteger(row, 'weight_capacity_grams'),
    createdAt: readTimestamp(row, 'created_at'),
  });
}

function stackFromRow(row: Record<string, unknown>): InventoryStackRow {
  return Object.freeze({
    id: String(row['id']) as Uuid,
    containerId: String(row['container_id']) as Uuid,
    ownerCharacterId: String(row['owner_character_id']) as Uuid,
    itemId: String(row['item_id']),
    quantity: readInteger(row, 'quantity'),
    metadata: readMetadata(row),
    createdAt: readTimestamp(row, 'created_at'),
    updatedAt: readTimestamp(row, 'updated_at'),
  });
}

function placeholders(count: number, start = 1, cast = 'uuid'): string {
  return Array.from({ length: count }, (_, index) => `$${start + index}::${cast}`).join(', ');
}

function operationContainerIds(movement: PersistentInventoryMovement): readonly Uuid[] {
  const ids = [movement.sourceContainerId, movement.destinationContainerId].filter(
    (id): id is Uuid => id !== null,
  );
  return [...new Set(ids)].sort();
}

function operationOwnerIds(operation: PersistInventoryOperation): readonly Uuid[] {
  if (!Array.isArray(operation.authorizedContainerOwnerCharacterIds)) {
    throw new DomainError('FORBIDDEN', 'Inventory container authorization is required.');
  }
  return [
    ...new Set(
      operation.authorizedContainerOwnerCharacterIds.map((id) =>
        requireUuid(id, 'authorized container owner character ID'),
      ),
    ),
  ];
}

function validateOperation(input: PersistInventoryOperation): PersistInventoryOperation {
  if (typeof input.idempotencyKey !== 'string' || !REQUEST_ID_PATTERN.test(input.idempotencyKey)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory idempotency key.');
  }
  if (
    typeof input.commandFingerprint !== 'string' ||
    !FINGERPRINT_PATTERN.test(input.commandFingerprint)
  ) {
    throw new DomainError(
      'INVALID_FINGERPRINT',
      'Inventory command fingerprint must be SHA-256 hex.',
    );
  }
  if (!OPERATION_KINDS.includes(input.operation) || input.movement.operation !== input.operation) {
    throw new DomainError('INVALID_OPERATION', 'Inventory operation and movement do not match.');
  }
  if (!ITEM_ID_PATTERN.test(input.movement.itemId)) {
    throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory item ID.');
  }
  if (
    !Number.isSafeInteger(input.movement.quantity) ||
    input.movement.quantity < 1 ||
    input.movement.quantity > MAX_QUANTITY
  ) {
    throw new DomainError('INVALID_QUANTITY', 'Inventory quantity must be between 1 and 1000.');
  }
  const sourceContainerId =
    input.movement.sourceContainerId === null
      ? null
      : requireUuid(input.movement.sourceContainerId, 'source container ID');
  const destinationContainerId =
    input.movement.destinationContainerId === null
      ? null
      : requireUuid(input.movement.destinationContainerId, 'destination container ID');
  const sourceOwnerCharacterId =
    input.movement.sourceOwnerCharacterId === null
      ? null
      : requireUuid(input.movement.sourceOwnerCharacterId, 'source owner character ID');
  const destinationOwnerCharacterId =
    input.movement.destinationOwnerCharacterId === null
      ? null
      : requireUuid(input.movement.destinationOwnerCharacterId, 'destination owner character ID');
  requireUuid(input.actorAccountId, 'actor account ID');
  if (input.actorCharacterId !== null) requireUuid(input.actorCharacterId, 'actor character ID');

  const movement = Object.freeze({
    ...input.movement,
    sourceContainerId,
    destinationContainerId,
    sourceOwnerCharacterId,
    destinationOwnerCharacterId,
    metadata: readInputMetadata(input.movement.metadata),
  });
  const shapeIsValid =
    (input.operation === 'mint' &&
      sourceContainerId === null &&
      destinationContainerId !== null &&
      sourceOwnerCharacterId === null &&
      destinationOwnerCharacterId !== null) ||
    (input.operation === 'consume' &&
      sourceContainerId !== null &&
      destinationContainerId === null &&
      sourceOwnerCharacterId !== null &&
      destinationOwnerCharacterId === null) ||
    (input.operation === 'move' &&
      sourceContainerId !== null &&
      destinationContainerId !== null &&
      sourceContainerId !== destinationContainerId &&
      sourceOwnerCharacterId !== null &&
      destinationOwnerCharacterId === sourceOwnerCharacterId) ||
    (input.operation === 'transfer' &&
      sourceContainerId !== null &&
      destinationContainerId !== null &&
      sourceContainerId !== destinationContainerId &&
      sourceOwnerCharacterId !== null &&
      destinationOwnerCharacterId !== null &&
      destinationOwnerCharacterId !== sourceOwnerCharacterId);
  if (!shapeIsValid) {
    throw new DomainError(
      'INVALID_OPERATION',
      'Inventory movement fields do not match the operation.',
    );
  }

  return Object.freeze({
    ...input,
    actorAccountId: requireUuid(input.actorAccountId, 'actor account ID'),
    actorCharacterId:
      input.actorCharacterId === null
        ? null
        : requireUuid(input.actorCharacterId, 'actor character ID'),
    authorizedContainerOwnerCharacterIds: Object.freeze([...operationOwnerIds(input)]),
    movement: movement as Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'>,
  });
}

function readInputMetadata(metadata: PersistentInventoryMetadata): PersistentInventoryMetadata {
  if (!isPlainRecord(metadata)) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata must be a JSON object.');
  }
  let serialized: string;
  try {
    serialized = JSON.stringify(metadata);
  } catch {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata must be serializable JSON.');
  }
  if (Buffer.byteLength(serialized, 'utf8') > 4_096) {
    throw new DomainError('INVALID_METADATA', 'Inventory metadata exceeds 4 KiB.');
  }
  return freezeMetadataValue(JSON.parse(serialized)) as PersistentInventoryMetadata;
}

const CONTAINER_COLUMNS = `id, kind, location_id, owner_character_id,
  slot_capacity, weight_capacity_grams, created_at`;
const STACK_COLUMNS = `id, container_id, owner_character_id, item_id, quantity,
  metadata::text AS metadata_json, created_at, updated_at`;
const RECEIPT_COLUMNS = `o.id AS operation_id, o.idempotency_key, o.command_fingerprint,
  o.kind AS operation_kind, o.actor_account_id, o.actor_character_id,
  o.created_at AS operation_created_at, m.id AS movement_id,
  m.item_id, m.source_container_id, m.destination_container_id,
  m.source_owner_character_id, m.destination_owner_character_id, m.quantity,
  m.metadata::text AS movement_metadata_json, m.created_at AS movement_created_at`;

function receiptFromRow(row: Record<string, unknown>): PersistentInventoryReceipt {
  const operation = String(row['operation_kind']) as PersistentInventoryOperationKind;
  if (!OPERATION_KINDS.includes(operation)) {
    throw new DomainError('INVENTORY_CORRUPT', 'Stored inventory operation kind is unknown.');
  }
  const movement: PersistentInventoryMovement = Object.freeze({
    movementId: String(row['movement_id']) as Uuid,
    operation,
    itemId: String(row['item_id']),
    sourceContainerId: readNullableUuid(row, 'source_container_id'),
    destinationContainerId: readNullableUuid(row, 'destination_container_id'),
    sourceOwnerCharacterId: readNullableUuid(row, 'source_owner_character_id'),
    destinationOwnerCharacterId: readNullableUuid(row, 'destination_owner_character_id'),
    quantity: readInteger(row, 'quantity'),
    metadata: readMetadata(row, 'movement_metadata_json'),
    createdAt: readTimestamp(row, 'movement_created_at'),
  });
  return Object.freeze({
    operationId: String(row['operation_id']) as Uuid,
    idempotencyKey: String(row['idempotency_key']),
    commandFingerprint: String(row['command_fingerprint']),
    operation,
    actorAccountId: String(row['actor_account_id']) as Uuid,
    actorCharacterId: readNullableUuid(row, 'actor_character_id'),
    movement,
    createdAt: readTimestamp(row, 'operation_created_at'),
  });
}

async function findReceiptByKey(
  executor: SqlExecutor,
  idempotencyKey: string,
): Promise<PersistentInventoryReceipt | null> {
  const result = await executor.query(
    `SELECT ${RECEIPT_COLUMNS}
       FROM inventory_operations o
       JOIN inventory_movements m ON m.operation_id = o.id
       JOIN inventory_operation_finalizations f ON f.operation_id = o.id
      WHERE o.idempotency_key = $1`,
    [idempotencyKey],
  );
  const row = result.rows[0];
  return row === undefined ? null : receiptFromRow(row);
}

async function lockContainers(
  executor: SqlExecutor,
  ids: readonly Uuid[],
): Promise<readonly InventoryContainerRow[]> {
  if (ids.length === 0 || ids.length > 2) {
    throw new DomainError(
      'INVALID_OPERATION',
      'An inventory operation must reference one or two containers.',
    );
  }
  const ordered = [...new Set(ids.map((id) => requireUuid(id, 'container ID')))].sort();
  const result = await executor.query(
    `SELECT ${CONTAINER_COLUMNS}
       FROM inventory_containers
      WHERE id IN (${placeholders(ordered.length)})
      ORDER BY id FOR UPDATE`,
    ordered,
  );
  if (result.rows.length !== ordered.length) {
    throw new DomainError('CONTAINER_NOT_FOUND', 'Unknown inventory container.');
  }
  return result.rows.map(containerFromRow);
}

function authorizeLockedContainers(
  containers: readonly InventoryContainerRow[],
  authorizedOwners: readonly Uuid[],
): void {
  const allowlist = new Set(authorizedOwners);
  if (containers.some((container) => !allowlist.has(container.ownerCharacterId))) {
    throw new DomainError(
      'FORBIDDEN',
      'Inventory container ownership changed or access was not authorized.',
    );
  }
}

interface StackTotals {
  readonly slots: number;
  readonly weightGrams: number;
}

async function stackTotals(
  executor: SqlExecutor,
  ids: readonly Uuid[],
): Promise<ReadonlyMap<Uuid, StackTotals>> {
  const result = await executor.query(
    `SELECT s.container_id, COUNT(*)::text AS slots,
            COALESCE(SUM(s.quantity::numeric * d.weight_grams), 0)::text AS weight_grams
       FROM inventory_stacks s
       JOIN inventory_item_definitions d ON d.id = s.item_id
      WHERE s.container_id IN (${placeholders(ids.length)})
      GROUP BY s.container_id`,
    ids,
  );
  const totals = new Map<Uuid, StackTotals>();
  for (const row of result.rows) {
    const slots = Number(row['slots']);
    const weightGrams = Number(row['weight_grams']);
    if (!Number.isSafeInteger(slots) || !Number.isSafeInteger(weightGrams)) {
      throw new DomainError('INVENTORY_CORRUPT', 'Container inventory totals exceed safe bounds.');
    }
    totals.set(String(row['container_id']) as Uuid, { slots, weightGrams });
  }
  return totals;
}

async function loadStacks(
  executor: SqlExecutor,
  ids: readonly Uuid[],
): Promise<readonly InventoryStackRow[]> {
  const result = await executor.query(
    `SELECT ${STACK_COLUMNS} FROM inventory_stacks
      WHERE container_id IN (${placeholders(ids.length)})
      ORDER BY id FOR UPDATE`,
    ids,
  );
  return result.rows.map(stackFromRow);
}

async function loadItemDefinition(
  executor: SqlExecutor,
  itemId: string,
): Promise<PersistentInventoryItemDefinition> {
  const result = await executor.query(
    `SELECT id, display_name, weight_grams, max_stack, tradeable
       FROM inventory_item_definitions WHERE id = $1`,
    [itemId],
  );
  const row = result.rows[0];
  if (row === undefined) throw new DomainError('ITEM_NOT_FOUND', 'Unknown inventory item.');
  return itemDefinitionFromRow(row);
}

function matchingStacks(
  stacks: readonly InventoryStackRow[],
  containerId: Uuid,
  ownerCharacterId: Uuid,
  itemId: string,
  metadata: PersistentInventoryMetadata,
): readonly InventoryStackRow[] {
  const target = stableJson(metadata);
  return stacks
    .filter(
      (stack) =>
        stack.containerId === containerId &&
        stack.ownerCharacterId === ownerCharacterId &&
        stack.itemId === itemId &&
        stableJson(stack.metadata) === target,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
}

function assertDestinationCapacity(input: {
  readonly destination: InventoryContainerRow;
  readonly totals: StackTotals;
  readonly compatibleStacks: readonly InventoryStackRow[];
  readonly quantity: number;
  readonly weightGrams: number;
  readonly maxStack: number;
}): void {
  const mergeSpace = input.compatibleStacks.reduce(
    (space, stack) => space + Math.max(0, input.maxStack - stack.quantity),
    0,
  );
  const extraQuantity = Math.max(0, input.quantity - mergeSpace);
  const extraSlots = Math.ceil(extraQuantity / input.maxStack);
  if (input.totals.slots + extraSlots > input.destination.slotCapacity) {
    throw new DomainError('CAPACITY_LIMIT', 'Inventory container has no free slots.');
  }
  if (
    input.totals.weightGrams + input.quantity * input.weightGrams >
    input.destination.weightCapacityGrams
  ) {
    throw new DomainError('CAPACITY_LIMIT', 'Inventory container weight capacity exceeded.');
  }
}

async function removeSourceQuantity(input: {
  readonly executor: SqlExecutor;
  readonly sourceStacks: readonly InventoryStackRow[];
  readonly quantity: number;
}): Promise<void> {
  let remaining = input.quantity;
  for (const stack of input.sourceStacks) {
    if (remaining === 0) break;
    const removed = Math.min(stack.quantity, remaining);
    if (removed === stack.quantity) {
      await input.executor.query('DELETE FROM inventory_stacks WHERE id = $1::uuid', [stack.id]);
    } else {
      await input.executor.query(
        `UPDATE inventory_stacks
            SET quantity = quantity - $2::integer, updated_at = clock_timestamp()
          WHERE id = $1::uuid`,
        [stack.id, removed],
      );
    }
    remaining -= removed;
  }
  if (remaining !== 0) throw new DomainError('INSUFFICIENT_ITEMS', 'Not enough inventory items.');
}

async function addDestinationQuantity(input: {
  readonly executor: SqlExecutor;
  readonly destination: InventoryContainerRow;
  readonly compatibleStacks: readonly InventoryStackRow[];
  readonly ownerCharacterId: Uuid;
  readonly itemId: string;
  readonly metadata: PersistentInventoryMetadata;
  readonly quantity: number;
  readonly maxStack: number;
}): Promise<void> {
  let remaining = input.quantity;
  for (const stack of input.compatibleStacks) {
    if (remaining === 0) break;
    const added = Math.min(input.maxStack - stack.quantity, remaining);
    if (added <= 0) continue;
    await input.executor.query(
      `UPDATE inventory_stacks
          SET quantity = quantity + $2::integer, updated_at = clock_timestamp()
        WHERE id = $1::uuid`,
      [stack.id, added],
    );
    remaining -= added;
  }
  while (remaining > 0) {
    const quantity = Math.min(remaining, input.maxStack);
    await input.executor.query(
      `INSERT INTO inventory_stacks
         (id, container_id, owner_character_id, item_id, quantity, metadata)
       VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5::integer, $6::jsonb)`,
      [
        newUuid(),
        input.destination.id,
        input.ownerCharacterId,
        input.itemId,
        quantity,
        JSON.stringify(input.metadata),
      ],
    );
    remaining -= quantity;
  }
}

/** Transactional PostgreSQL implementation of the persistent inventory port. */
export class PgInventoryRepository implements PersistentInventoryStore {
  readonly #sql: SqlSession;

  public constructor(sql: SqlSession) {
    this.#sql = sql;
  }

  public async registerItemDefinition(
    input: PersistentInventoryItemDefinition,
  ): Promise<PersistentInventoryItemDefinition> {
    if (typeof input.id !== 'string' || !ITEM_ID_PATTERN.test(input.id)) {
      throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory item ID.');
    }
    const displayName = input.displayName.trim();
    if (
      displayName.length < 2 ||
      displayName.length > 60 ||
      /[\u0000-\u001f\u007f]/.test(displayName) ||
      !Number.isSafeInteger(input.weightGrams) ||
      input.weightGrams < 1 ||
      input.weightGrams > 100_000 ||
      !Number.isSafeInteger(input.maxStack) ||
      input.maxStack < 1 ||
      input.maxStack > MAX_QUANTITY ||
      typeof input.tradeable !== 'boolean'
    ) {
      throw new DomainError('INVALID_ITEM', 'Inventory item definition is invalid.');
    }
    try {
      const result = await this.#sql.query(
        `INSERT INTO inventory_item_definitions (id, display_name, weight_grams, max_stack, tradeable)
         VALUES ($1, $2, $3::integer, $4::integer, $5)
         RETURNING id, display_name, weight_grams, max_stack, tradeable`,
        [input.id, displayName, input.weightGrams, input.maxStack, input.tradeable],
      );
      return itemDefinitionFromRow(result.rows[0] ?? {});
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new DomainError('ITEM_EXISTS', 'Inventory item ID is already registered.');
      }
      throw error;
    }
  }

  public async getItemDefinition(
    itemId: string,
  ): Promise<PersistentInventoryItemDefinition | null> {
    if (typeof itemId !== 'string' || !ITEM_ID_PATTERN.test(itemId)) {
      throw new DomainError('INVALID_IDENTIFIER', 'Invalid inventory item ID.');
    }
    const result = await this.#sql.query(
      `SELECT id, display_name, weight_grams, max_stack, tradeable
         FROM inventory_item_definitions WHERE id = $1`,
      [itemId],
    );
    const row = result.rows[0];
    return row === undefined ? null : itemDefinitionFromRow(row);
  }

  public async createContainer(
    input: CreatePersistentInventoryContainer,
  ): Promise<PersistentInventoryContainer> {
    const id = requireUuid(input.id, 'container ID');
    const locationId = requireUuid(input.locationId, 'container location ID');
    const ownerCharacterId = requireUuid(input.ownerCharacterId, 'container owner character ID');
    if (!CONTAINER_KINDS.includes(input.kind)) {
      throw new DomainError('INVALID_CONTAINER', 'Unknown inventory container kind.');
    }
    if (
      !Number.isSafeInteger(input.slotCapacity) ||
      input.slotCapacity < 1 ||
      input.slotCapacity > 10_000 ||
      !Number.isSafeInteger(input.weightCapacityGrams) ||
      input.weightCapacityGrams < 1 ||
      input.weightCapacityGrams > 1_000_000_000 ||
      (input.kind === 'character' && locationId !== ownerCharacterId)
    ) {
      throw new DomainError(
        'INVALID_CONTAINER',
        'Inventory container capacity or location is invalid.',
      );
    }
    try {
      const result = await this.#sql.query(
        `INSERT INTO inventory_containers
           (id, kind, location_id, owner_character_id, slot_capacity, weight_capacity_grams)
         VALUES ($1::uuid, $2, $3::uuid, $4::uuid, $5::integer, $6::integer)
         RETURNING ${CONTAINER_COLUMNS}`,
        [
          id,
          input.kind,
          locationId,
          ownerCharacterId,
          input.slotCapacity,
          input.weightCapacityGrams,
        ],
      );
      return containerFromRow(result.rows[0] ?? {});
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new DomainError(
          'CONTAINER_EXISTS',
          'Inventory container ID or location already exists.',
        );
      }
      if (isForeignKeyViolation(error)) {
        throw new DomainError('CHARACTER_NOT_FOUND', 'Inventory container owner does not exist.');
      }
      throw error;
    }
  }

  public async getContainer(containerId: Uuid): Promise<PersistentInventoryContainer | null> {
    const id = requireUuid(containerId, 'container ID');
    const result = await this.#sql.query(
      `SELECT ${CONTAINER_COLUMNS} FROM inventory_containers WHERE id = $1::uuid`,
      [id],
    );
    const row = result.rows[0];
    return row === undefined ? null : containerFromRow(row);
  }

  public async listContainerStacks(
    containerId: Uuid,
  ): Promise<readonly PersistentInventoryStack[]> {
    const id = requireUuid(containerId, 'container ID');
    const result = await this.#sql.query(
      `SELECT ${STACK_COLUMNS} FROM inventory_stacks
        WHERE container_id = $1::uuid
        ORDER BY item_id, owner_character_id, id`,
      [id],
    );
    return Object.freeze(result.rows.map(stackFromRow));
  }

  public async apply(input: PersistInventoryOperation): Promise<PersistentInventoryReceipt> {
    const operation = validateOperation(input);
    const ownerAllowlist = operationOwnerIds(operation);
    const requestedContainerIds = operationContainerIds(
      operation.movement as PersistentInventoryMovement,
    );
    return this.#sql.withTransaction(async (executor) => {
      const existing = await findReceiptByKey(executor, operation.idempotencyKey);
      if (existing !== null) {
        if (existing.commandFingerprint !== operation.commandFingerprint) {
          throw new DomainError(
            'IDEMPOTENCY_CONFLICT',
            'Request ID reused with different inventory arguments.',
          );
        }
        const containers = await lockContainers(executor, operationContainerIds(existing.movement));
        authorizeLockedContainers(containers, ownerAllowlist);
        return existing;
      }

      const containers = await lockContainers(executor, requestedContainerIds);
      authorizeLockedContainers(containers, ownerAllowlist);

      // A same-key request can have waited behind another transaction while
      // acquiring these deterministic locks. Recheck before validating stock.
      const raced = await findReceiptByKey(executor, operation.idempotencyKey);
      if (raced !== null) {
        if (raced.commandFingerprint !== operation.commandFingerprint) {
          throw new DomainError(
            'IDEMPOTENCY_CONFLICT',
            'Request ID reused with different inventory arguments.',
          );
        }
        return raced;
      }

      const inserted = await executor.query(
        `INSERT INTO inventory_operations
           (id, idempotency_key, command_fingerprint, kind, actor_account_id, actor_character_id)
         VALUES ($1::uuid, $2, $3, $4, $5::uuid, $6::uuid)
         ON CONFLICT (idempotency_key) DO NOTHING
         RETURNING id`,
        [
          newUuid(),
          operation.idempotencyKey,
          operation.commandFingerprint,
          operation.operation,
          operation.actorAccountId,
          operation.actorCharacterId,
        ],
      );
      if (inserted.rows.length === 0) {
        const winner = await findReceiptByKey(executor, operation.idempotencyKey);
        if (winner === null) {
          throw new DomainError(
            'INVENTORY_CONFLICT',
            'Concurrent inventory operation is not visible.',
          );
        }
        if (winner.commandFingerprint !== operation.commandFingerprint) {
          throw new DomainError(
            'IDEMPOTENCY_CONFLICT',
            'Request ID reused with different inventory arguments.',
          );
        }
        return winner;
      }
      const operationId = String(inserted.rows[0]?.['id']) as Uuid;

      const definition = await loadItemDefinition(executor, operation.movement.itemId);
      if (operation.operation === 'transfer' && !definition.tradeable) {
        throw new DomainError('NOT_TRADEABLE', 'This item cannot be transferred to another owner.');
      }

      const stacks = await loadStacks(executor, requestedContainerIds);
      const totals = await stackTotals(executor, requestedContainerIds);
      const containersById = new Map(containers.map((container) => [container.id, container]));
      const sourceContainerId = operation.movement.sourceContainerId;
      const destinationContainerId = operation.movement.destinationContainerId;
      const sourceOwnerId = operation.movement.sourceOwnerCharacterId;
      const destinationOwnerId = operation.movement.destinationOwnerCharacterId;
      let sourceMatches: readonly InventoryStackRow[] = [];

      if (sourceContainerId !== null && sourceOwnerId !== null) {
        sourceMatches = matchingStacks(
          stacks,
          sourceContainerId,
          sourceOwnerId,
          operation.movement.itemId,
          operation.movement.metadata,
        );
        const available = sourceMatches.reduce((count, stack) => count + stack.quantity, 0);
        if (available < operation.movement.quantity) {
          throw new DomainError('INSUFFICIENT_ITEMS', 'Not enough inventory items.');
        }
      }

      let destinationMatches: readonly InventoryStackRow[] = [];
      if (destinationContainerId !== null && destinationOwnerId !== null) {
        const destination = containersById.get(destinationContainerId);
        if (destination === undefined) {
          throw new DomainError('CONTAINER_NOT_FOUND', 'Unknown destination inventory container.');
        }
        destinationMatches = matchingStacks(
          stacks,
          destinationContainerId,
          destinationOwnerId,
          operation.movement.itemId,
          operation.movement.metadata,
        );
        assertDestinationCapacity({
          destination,
          totals: totals.get(destinationContainerId) ?? { slots: 0, weightGrams: 0 },
          compatibleStacks: destinationMatches,
          quantity: operation.movement.quantity,
          weightGrams: definition.weightGrams,
          maxStack: definition.maxStack,
        });
      }

      if (sourceContainerId !== null) {
        await removeSourceQuantity({
          executor,
          sourceStacks: sourceMatches,
          quantity: operation.movement.quantity,
        });
      }
      if (destinationContainerId !== null && destinationOwnerId !== null) {
        const destination = containersById.get(destinationContainerId);
        if (destination === undefined) {
          throw new DomainError('CONTAINER_NOT_FOUND', 'Unknown destination inventory container.');
        }
        await addDestinationQuantity({
          executor,
          destination,
          compatibleStacks: destinationMatches,
          ownerCharacterId: destinationOwnerId,
          itemId: operation.movement.itemId,
          metadata: operation.movement.metadata,
          quantity: operation.movement.quantity,
          maxStack: definition.maxStack,
        });
      }

      const movement = operation.movement;
      await executor.query(
        `INSERT INTO inventory_movements
           (id, operation_id, operation_kind, item_id, source_container_id,
            destination_container_id, source_owner_character_id,
            destination_owner_character_id, quantity, metadata)
         VALUES ($1::uuid, $2::uuid, $3, $4, $5::uuid, $6::uuid,
                 $7::uuid, $8::uuid, $9::integer, $10::jsonb)`,
        [
          newUuid(),
          operationId,
          operation.operation,
          movement.itemId,
          movement.sourceContainerId,
          movement.destinationContainerId,
          movement.sourceOwnerCharacterId,
          movement.destinationOwnerCharacterId,
          movement.quantity,
          JSON.stringify(movement.metadata),
        ],
      );
      await executor.query(
        'INSERT INTO inventory_operation_finalizations (operation_id) VALUES ($1::uuid)',
        [operationId],
      );
      const receipt = await findReceiptByKey(executor, operation.idempotencyKey);
      if (receipt === null) {
        throw new DomainError('INVENTORY_CORRUPT', 'Inventory receipt disappeared before commit.');
      }
      return receipt;
    });
  }
}
