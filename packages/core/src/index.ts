export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type AccountId = Brand<string, 'AccountId'>;
export type CharacterId = Brand<string, 'CharacterId'>;
export type PlayerId = Brand<string, 'PlayerId'>;
export type RequestId = Brand<string, 'RequestId'>;

export type { Uuid } from './ids.js';
export { isUuid, newUuid, requireUuid } from './ids.js';

export {
  SESSION_CAPABILITIES,
  InMemorySessionStore,
  SessionService,
  nodeHashSource,
  nodeRandomSource,
} from './sessions.js';
export type {
  HashSource,
  IssueSessionCommand,
  IssuedSession,
  RandomSource,
  SessionPrincipal,
  SessionRecord,
  SessionStore,
} from './sessions.js';

export interface Clock {
  now(): Date;
}

export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export class DomainError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export const assertMinorUnits = (value: bigint): bigint => {
  if (value < 0n) {
    throw new DomainError('NEGATIVE_MONEY', 'Money cannot be negative in this context.');
  }

  return value;
};

export { InMemoryRoleplay } from './roleplay.js';
export type {
  Capability,
  CharacterRecord,
  GrantCommand,
  LedgerEntry,
  Principal,
  TransferCommand,
} from './roleplay.js';

export { InMemoryInventory } from './inventory.js';
export type {
  ConsumeItemCommand,
  InventoryReceipt,
  InventoryStack,
  ItemDefinition,
  MintItemCommand,
  TransferItemCommand,
} from './inventory.js';

export type {
  LocationFilter,
  NearbyLocation,
  PlannedLocation,
  PlanningBounds,
  PlanningLayer,
  PlanningPoint,
  PlanningProvenance,
  PlanningStatus,
  PlanningUse,
} from './world-planning.js';
export { WorldPlanningCatalog } from './world-planning.js';
