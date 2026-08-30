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
