import type { CharacterId, RequestId } from '@gta6-rp/core';

export interface CommandEnvelope<Type extends string, Payload> {
  readonly requestId: RequestId;
  readonly type: Type;
  readonly actorCharacterId: CharacterId;
  readonly payload: Payload;
  readonly issuedAt: string;
}

export interface DomainEvent<Type extends string, Payload> {
  readonly id: string;
  readonly type: Type;
  readonly aggregateId: string;
  readonly payload: Payload;
  readonly occurredAt: string;
}

export interface IdempotentCommand {
  readonly idempotencyKey: string;
}

export {
  GTA6_UNVERIFIED_CAPABILITIES,
  PORTABLE_CAPABILITIES,
  UnsupportedRuntimeCapabilityError,
  requireRuntimeCapabilities,
} from './runtime-port.js';
export type {
  ClientIntent,
  PortableCapability,
  PortableRuntimePort,
  ResolvedSession,
  RuntimeTarget,
  ServerProjection,
} from './runtime-port.js';

export { GTA6_MINIMUM_RUNTIME_REQUIREMENTS, inspectGta6RuntimeEvidence } from './runtime-evidence.js';
export type {
  Gta6EvidenceAssessment,
  Gta6EvidenceOrigin,
  Gta6MinimumRequirement,
  Gta6RuntimeEvidence,
} from './runtime-evidence.js';
