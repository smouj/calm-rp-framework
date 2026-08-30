# Threat Model

## Assets to protect

- persistent character state
- money and ledger history
- inventory and ownership
- roles, permissions and faction ranks
- administrative actions
- identity/session mappings
- audit history

## Trust boundaries

1. **Game/UI client -> server:** always untrusted.
2. **Public API -> application:** authenticated but still untrusted input.
3. **Application -> PostgreSQL:** privileged, tightly scoped.
4. **Application -> Redis:** non-authoritative; cache compromise must not mint canonical state.
5. **Game adapter -> domain:** adapter data must pass domain validation.

## Primary abuse cases

- forged money/inventory updates
- replayed purchase/transfer commands
- duplicate rewards caused by retries
- privilege escalation through client-supplied role/rank
- entity ownership spoofing
- race-condition duplication
- mass event spam / resource exhaustion
- SQL/command injection
- stolen session/token reuse

## Required controls

- server-side authorization
- idempotency keys for retryable mutations
- database transactions for multi-record changes
- immutable financial ledger entries
- optimistic/pessimistic concurrency where invariants require it
- rate limiting at adapters/transports
- structured audit events
- secrets outside source control
- explicit administrative permissions

## Non-goals for this phase

No anti-cheat implementation is claimed before a concrete game/runtime environment exists. The architectural requirement is that authoritative RP state never depends solely on client assertions.
