# Portable RP reference: characters and money

This development branch adds `InMemoryRoleplay` in `packages/core/src/roleplay.ts` and a deterministic sample in `adapters/simulator/src/roleplay-scenario.ts`.

## Implemented in memory (not production)

- Server principal/account ownership checks for character registration and transfers.
- Name and identifier validation, unique character IDs.
- Server-authorized grants, integer minor-unit balance accounting, bounded amounts.
- Positive transfer validation, overdraft and self-transfer rejection.
- Idempotency request-key handling and immutable audit-like ledger receipts.
- Deterministic two-character scenario and tests.

## Security caveat

The caller-supplied `Principal` in this reference model is trusted **by assumption**. A real network service MUST resolve it from authenticated server sessions, not deserialize it from client input. Balances and ledger are in process memory, not persistent. The model cannot protect against process restarts, multiple processes or database races. The website's standalone browser demo is educational and DOES NOT invoke this TypeScript code.

## Production readiness gates

- PostgreSQL persistence with durable ledger and unique idempotency keys.
- Serializable transactions/row locks and tests for concurrent double-spends.
- Session authentication, authorization service and staff audit reasons.
- Versioned network contracts and bounded rate-limited request handlers.
- Migration, rollback, backup and restore exercises.
- Restart and multi-instance test coverage.
- GTA VI integration requires a separately authorized, documented adapter.

No RP server, player networking, inventory, vehicles, property or jobs are implemented by this slice.
