# ADR 0008 — Persistent inventory and generalized containers

- **Status:** Accepted for F2 implementation, 2026-11-27
- **Scope:** CALM-owned roleplay inventory contracts and PostgreSQL persistence
- **Related:** [ADR-0007](./0007-calm-essentials-framework-scope.md), [F2 roadmap](../roadmap/ROADMAP.md#f2--economy-and-inventory), [issue #54](https://github.com/smouj/calm-rp-framework/issues/54)

## Context

`packages/core/src/inventory.ts` is a useful synchronous reference for item rules, ownership, capacity and idempotency. It has no durable storage, transaction boundary, session authentication or concurrent-writer protection. CALM needs to preserve this simulator-facing behavior while introducing a separately named persistent contract. The framework is game-independent; no GTA VI runtime, native, file format or storage identifier is available as an implementation dependency.

## Decisions

1. **A container represents a physical storage location.** Its CALM UUID and `kind` identify the storage object (`character`, `vehicle`, `property` or `warehouse`). `location_id` is a CALM UUID for the corresponding domain object. A future adapter resolves external object IDs to these UUIDs through a server-owned port; client-supplied game IDs are not authoritative.
2. **Container ownership and item ownership are separate.** A container records its owning character; every stack separately records the character who owns its items. Moving an item changes its container and creates an immutable movement receipt while keeping item ownership unchanged. A trade changes the item owner and is rejected for non-tradeable definitions.
3. **Item definitions and operation history are immutable.** A corrected definition receives a new item ID. Each operation has one unique idempotency key and SHA-256 command fingerprint, one movement row, and one append-only finalization. The operation and movement together form the stable receipt. Same-key/same-fingerprint retries return that stored receipt; a different fingerprint is a conflict.
4. **Stacks are mutable projections; movements are the audit record.** Stack rows carry bounded JSON object metadata, count, item owner and container. A stack cannot exceed its item definition's maximum. Capacity is expressed as positive slot and gram limits per container; one stack row consumes one slot.
5. **The service is authoritative.** Public transport accepts a bearer token and domain command, never a principal, account ID or capability list from the caller. The server resolves `SessionPrincipal` from `SessionService`, verifies character ownership and container access through server-owned directories, then starts one SQL transaction. It locks all involved containers by sorted UUID before checking stock, trade rules, stack limits and destination capacity. Inventory changes, immutable movement, idempotency record and finalization commit together.
6. **Database guards are defense in depth.** Additive migration `0005_persistent_inventory.sql` leaves F1 tables untouched, enforces shape and append-only invariants, serializes stack capacity writes on container rows, and rejects unfinalized operations at commit. Production credentials must not have superuser or trigger-bypass privileges.
7. **The existing in-memory API remains a reference.** It is not renamed or silently upgraded to claim persistence. Persistent contracts use distinct type names until implementation and migration acceptance are complete.

## Consequences

- This first delivery establishes the schema and stable core/store contracts only. The transactional repository and authenticated domain service follow in a separate change; simulator restart and real PostgreSQL concurrency acceptance follow after that.
- `vehicle`, `property` and `warehouse` are CALM domain kinds. Their rows do not assert the existence of matching GTA VI objects or interfaces.
- Item metadata is a JSON object capped at 4 KiB. Applications must additionally validate allowed keys and values for each item type.
- Capacity enforcement is deterministic and serialized by container row locks. Every service path must lock all touched containers in ascending UUID order before reading stacks; database triggers provide a guard for direct writes.

## Revisit when

- CALM adds organization-owned containers, batch operations, item instances with unique identities, or access delegation; these require an explicit extension to the receipt and authorization model.
- A supported game adapter supplies a documented, authorized mapping from runtime storage entities to CALM UUIDs.
