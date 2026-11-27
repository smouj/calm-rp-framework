# Synthetic simulator domain example

**Status:** conceptual, compile-ready TypeScript. It demonstrates types and a server-side rule;
it is not a shipped progression service, transport handler, or GTA VI integration.

The public envelope types live in
[`packages/contracts/src/index.ts`](../../packages/contracts/src/index.ts). Domain errors,
session principals, UUID validation, and the character ownership port live in
[`packages/core/src/index.ts`](../../packages/core/src/index.ts).

```ts
import type { CommandEnvelope, DomainEvent } from '@gta6-rp/contracts';
import {
  DomainError,
  requireUuid,
  type CharacterOwnershipDirectory,
  type CharacterId,
  type SessionPrincipal,
  type Uuid,
} from '@gta6-rp/core';

type TrainingRequest = CommandEnvelope<'training.session.complete', { readonly minutes: number }>;

type TrainingRecorded = DomainEvent<
  'training.session.recorded',
  { readonly awardedPoints: number; readonly ruleVersion: 'demo-v1' }
>;

export async function recordTrainingRequest(
  principal: SessionPrincipal,
  ownership: CharacterOwnershipDirectory,
  command: TrainingRequest,
  eventId: Uuid,
  occurredAt: Date,
): Promise<TrainingRecorded> {
  const characterId = requireUuid(command.actorCharacterId, 'actor character ID');
  const ownerAccountId = await ownership.findOwnerAccount(characterId);

  if (ownerAccountId !== principal.accountId) {
    throw new DomainError('CHARACTER_FORBIDDEN', 'The session does not own this character.');
  }

  const minutes = command.payload.minutes;
  if (!Number.isSafeInteger(minutes) || minutes < 15 || minutes > 60) {
    throw new DomainError('INVALID_TRAINING_DURATION', 'Training must last 15 to 60 minutes.');
  }
  if (!Number.isFinite(occurredAt.getTime())) {
    throw new DomainError('INVALID_CLOCK', 'The server clock must return a valid date.');
  }

  // Fictional CALM community rule: award one point per completed 15-minute block.
  return {
    id: eventId,
    type: 'training.session.recorded',
    aggregateId: characterId,
    payload: { awardedPoints: Math.floor(minutes / 15), ruleVersion: 'demo-v1' },
    occurredAt: occurredAt.toISOString(),
  };
}

const demoCharacterId = '11111111-1111-4111-8111-111111111111' as CharacterId;
const demoAccountId = '22222222-2222-4222-8222-222222222222' as Uuid;

const demoRequest: TrainingRequest = {
  requestId: 'demo-request-001' as TrainingRequest['requestId'],
  type: 'training.session.complete',
  actorCharacterId: demoCharacterId,
  payload: { minutes: 30 },
  issuedAt: '2026-11-27T12:00:00.000Z',
};

const demoPrincipal: SessionPrincipal = { accountId: demoAccountId, capabilities: [] };
const demoOwnership: CharacterOwnershipDirectory = {
  findOwnerAccount: async () => demoAccountId,
};

void recordTrainingRequest(
  demoPrincipal,
  demoOwnership,
  demoRequest,
  '33333333-3333-4333-8333-333333333333' as Uuid,
  new Date('2026-11-27T12:00:01.000Z'),
);
```

The character ID in the request is only an identifier to check. Authorization comes from the
server-resolved session principal and the ownership lookup, not from a client-provided account or
capability list. The `CommandEnvelope` type is compile-time only: a real transport must still
parse and bound untrusted JSON before calling a domain service. Production code would also persist
the result and an immutable audit/event record atomically, use `requestId` for idempotency, and
apply request limits at an exposed transport boundary. None of those behaviors is implemented by
this example.

The example's “training” points and UUIDs are synthetic CALM data. They do not model a GTA VI stat,
native, formula, server API, or gameplay guarantee.
