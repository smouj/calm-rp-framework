import type { Uuid } from './ids.js';

export type PersistentInventoryContainerKind = 'character' | 'vehicle' | 'property' | 'warehouse';

export type PersistentInventoryOperationKind = 'mint' | 'consume' | 'move' | 'transfer';

export type PersistentInventoryMetadataValue =
  | string
  | number
  | boolean
  | null
  | readonly PersistentInventoryMetadataValue[]
  | { readonly [key: string]: PersistentInventoryMetadataValue };

/** JSON object stored with a stack and copied into its immutable movement receipt. */
export type PersistentInventoryMetadata = Readonly<
  Record<string, PersistentInventoryMetadataValue>
>;

export interface PersistentInventoryItemDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly weightGrams: number;
  readonly maxStack: number;
  readonly tradeable: boolean;
}

/** `locationId` identifies the physical CALM domain object, not its owner. */
export interface PersistentInventoryContainer {
  readonly id: Uuid;
  readonly kind: PersistentInventoryContainerKind;
  readonly locationId: Uuid;
  readonly ownerCharacterId: Uuid;
  readonly slotCapacity: number;
  readonly weightCapacityGrams: number;
  readonly createdAt: Date;
}

export type CreatePersistentInventoryContainer = Omit<PersistentInventoryContainer, 'createdAt'>;

export interface PersistentInventoryStack {
  readonly id: Uuid;
  readonly containerId: Uuid;
  /** Item ownership can differ from the container owner. */
  readonly ownerCharacterId: Uuid;
  readonly itemId: string;
  readonly quantity: number;
  readonly metadata: PersistentInventoryMetadata;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** One immutable line describing a mint, consume, physical move or trade. */
export interface PersistentInventoryMovement {
  readonly movementId: Uuid;
  readonly operation: PersistentInventoryOperationKind;
  readonly itemId: string;
  readonly sourceContainerId: Uuid | null;
  readonly destinationContainerId: Uuid | null;
  readonly sourceOwnerCharacterId: Uuid | null;
  readonly destinationOwnerCharacterId: Uuid | null;
  readonly quantity: number;
  readonly metadata: PersistentInventoryMetadata;
  readonly createdAt: Date;
}

/** Stable receipt reconstructed from an immutable operation and movement row. */
export interface PersistentInventoryReceipt {
  readonly operationId: Uuid;
  readonly idempotencyKey: string;
  readonly commandFingerprint: string;
  readonly operation: PersistentInventoryOperationKind;
  readonly actorAccountId: Uuid;
  readonly actorCharacterId: Uuid | null;
  readonly movement: PersistentInventoryMovement;
  readonly createdAt: Date;
}

/** Internal write shape passed from an authenticated domain service to storage. */
export interface PersistInventoryOperation {
  readonly idempotencyKey: string;
  readonly commandFingerprint: string;
  readonly operation: PersistentInventoryOperationKind;
  readonly actorAccountId: Uuid;
  readonly actorCharacterId: Uuid | null;
  /** Owner IDs already checked by the authenticated service; storage rechecks under row locks. */
  readonly authorizedContainerOwnerCharacterIds: readonly Uuid[];
  readonly movement: Omit<PersistentInventoryMovement, 'movementId' | 'createdAt'>;
}

export interface PersistentInventoryCommandBase {
  readonly requestId: string;
  readonly itemId: string;
  readonly quantity: number;
  readonly metadata?: PersistentInventoryMetadata;
}

export interface MintPersistentInventoryCommand extends PersistentInventoryCommandBase {
  readonly toContainerId: Uuid;
  readonly toCharacterId: Uuid;
  /** Optional active admin character; the session account remains authoritative. */
  readonly actorCharacterId?: Uuid | null;
}

export interface ConsumePersistentInventoryCommand extends PersistentInventoryCommandBase {
  readonly actorCharacterId: Uuid;
  readonly fromContainerId: Uuid;
}

export interface MovePersistentInventoryCommand extends PersistentInventoryCommandBase {
  readonly actorCharacterId: Uuid;
  readonly fromContainerId: Uuid;
  readonly toContainerId: Uuid;
}

export interface TransferPersistentInventoryCommand extends PersistentInventoryCommandBase {
  readonly actorCharacterId: Uuid;
  readonly fromContainerId: Uuid;
  readonly toContainerId: Uuid;
  readonly toCharacterId: Uuid;
}

export type PersistentInventoryCommand =
  | MintPersistentInventoryCommand
  | ConsumePersistentInventoryCommand
  | MovePersistentInventoryCommand
  | TransferPersistentInventoryCommand;

export interface PersistentInventoryStore {
  /** Trusted setup path for immutable, CALM-owned item definitions. */
  registerItemDefinition(
    definition: PersistentInventoryItemDefinition,
  ): Promise<PersistentInventoryItemDefinition>;
  /** Trusted setup path; runtime client requests must never provision containers directly. */
  createContainer(
    container: CreatePersistentInventoryContainer,
  ): Promise<PersistentInventoryContainer>;
  /**
   * Atomically apply one movement or return its original idempotent receipt.
   * Implementations must lock every referenced container in ascending UUID
   * order, reload item definitions/stacks after the locks, verify each locked
   * container owner against `authorizedContainerOwnerCharacterIds`, and enforce
   * stock, tradeability, stack and capacity rules inside that transaction. The stock
   * mutation, operation, movement and finalization commit or roll back together.
   * A matching key/fingerprint returns the stored receipt; a changed fingerprint
   * rejects without writing.
   */
  apply(operation: PersistInventoryOperation): Promise<PersistentInventoryReceipt>;
  getItemDefinition(itemId: string): Promise<PersistentInventoryItemDefinition | null>;
  /** Read current state for queries only; never use unlocked reads to authorize a write. */
  getContainer(containerId: Uuid): Promise<PersistentInventoryContainer | null>;
  listContainerStacks(containerId: Uuid): Promise<readonly PersistentInventoryStack[]>;
}
