# ADR-0004: PostgreSQL authoritative, Redis ephemeral

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

A roleplay server contains state with very different durability requirements. Character identity, money, ownership, inventory and moderation history must survive process restarts and infrastructure replacement. Presence, short-lived locks and caches do not need the same durability contract.

Treating a cache as a second source of truth creates reconciliation and corruption risk, especially around economy and ownership.

## Decision

PostgreSQL is the planned authoritative durable data store for canonical RP state.

Redis may be introduced for ephemeral coordination, caching, presence, short-lived locks or rate-limit state where it provides measurable value. Redis data must be disposable and reconstructable without losing canonical server state.

Financial and ownership mutations are committed through transactional domain use cases backed by PostgreSQL. Cache updates are projections or optimizations, never the authoritative commit.

## Consequences

### Positive

- one clear durable source of truth;
- simpler recovery and reconciliation;
- transactional integrity for valuable state;
- cache loss does not become data loss;
- infrastructure can evolve without redefining domain ownership.

### Cost

- some reads may require explicit cache-aside logic later;
- high-throughput workloads may require careful database design before adding distributed stores;
- ephemeral coordination must tolerate Redis loss/restart.

## Guardrail

A feature may not require Redis to reconstruct a player's canonical balance, inventory, ownership, permissions or moderation history after a complete cache flush.

Adopting another authoritative data store requires a separate ADR and a migration/recovery design.
