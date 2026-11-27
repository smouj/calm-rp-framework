# ADR 0008 — Persistent GTA VI RP inventory and storage

- **Status:** Accepted for F2 implementation, 2026-11-27
- **Scope:** CALM-owned GTA VI RP inventory behavior and PostgreSQL persistence; not a game runtime adapter
- **Related:** [ADR-0009](./0009-gta-vi-first-product-scope.md), [F2 roadmap](../roadmap/ROADMAP.md#f2--gta-vi-rp-economy-carried-items-and-storage), [issue #54](https://github.com/smouj/calm-rp-framework/issues/54)

## Context

`packages/core/src/inventory.ts` is a synchronous reference for item rules, ownership, capacity and idempotency. It has no durable storage, transaction boundary, session authentication or concurrent-writer protection. CALM's GTA VI RP research identifies a useful distinction between what a character carries and items stored in a vehicle or property, with item ownership potentially independent of storage location. F2 persists CALM's roleplay state for that target model; it does not implement GTA VI's campaign inventory, equipment/loadout behavior, game files or runtime calls. The simulator is the verification tool until an authorized GTA VI runtime exists.

## Decisions

1. **A container represents a physical storage location.** Its CALM UUID and `kind` identify the storage object (`character`, `vehicle`, `property` or `warehouse`). `location_id` is a CALM UUID for the corresponding domain object. A future adapter resolves external object IDs to these UUIDs through a server-owned port; client-supplied game IDs are not authoritative.
2. **Container ownership and item ownership are separate.** A container records its owning character; every stack separately records the character who owns its items. Moving an item changes its container and creates an immutable movement receipt while keeping item ownership unchanged. A trade changes the item owner and is rejected for non-tradeable definitions.
3. **Item definitions and operation history are immutable.** A corrected definition receives a new item ID. Each operation has one unique idempotency key and SHA-256 command fingerprint, one movement row, and one append-only finalization. The operation and movement together form the stable receipt. Same-key/same-fingerprint retries return that stored receipt; a different fingerprint is a conflict.
4. **Stacks are mutable projections; movements are the audit record.** Stack rows carry bounded JSON object metadata, count, item owner and container. A stack cannot exceed its item definition's maximum. Capacity is expressed as positive slot and gram limits per container; one stack row consumes one slot.
5. **The service is authoritative.** Any future public transport must accept a bearer token and domain command, never a principal, account ID or capability list from the caller. The current service receives a server-resolved `SessionPrincipal`, verifies character ownership and container access through server-owned directories, then calls the repository. The repository locks all involved containers by sorted UUID before checking stock, trade rules, stack limits and destination capacity. Inventory changes, immutable movement, idempotency record and finalization commit together.
6. **Database guards are defense in depth.** Additive migration `0005_persistent_inventory.sql` leaves F1 tables untouched, enforces shape and append-only invariants, serializes stack capacity writes on container rows, and rejects unfinalized operations at commit. Production credentials must not have superuser or trigger-bypass privileges.
7. **The existing in-memory API remains a reference.** It is not renamed or silently upgraded to claim persistence. Persistent contracts use distinct type names until implementation and migration acceptance are complete.

## Consequences

- The schema and core/store contracts landed first; the authenticated transactional repository and domain service are implemented in the current F2 change. Embedded close/reopen, rollback and simulator flow are covered locally; live PostgreSQL 17 races remain a merge gate.
- `vehicle`, `property` and `warehouse` are CALM RP storage kinds informed by target-game roleplay requirements. Their rows do not assert that the current GTA VI campaign exposes matching multiplayer objects or interfaces.
- Item metadata is a JSON object capped at 4 KiB. Applications must additionally validate allowed keys and values for each item type.
- Capacity enforcement is deterministic and serialized by container row locks. Every service path must lock all touched containers in ascending UUID order before reading stacks; database triggers provide a guard for direct writes.

## Revisit when

- CALM adds organization-owned containers, batch operations, item instances with unique identities, or access delegation; these require an explicit extension to the receipt and authorization model.
- A supported game adapter supplies a documented, authorized mapping from runtime storage entities to CALM UUIDs.
