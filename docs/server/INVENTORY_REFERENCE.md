# In-memory inventory reference

**Status:** supplementary in-memory example; not the accepted persistent F2 service or a GTA VI integration.

This feature uses original TypeScript logic. It does not import FiveM/ESX/QBCore/Qbox source, Rockstar content, game archives or leaked files.

## Actual public API in this repository

- InMemoryInventory constructor receives a trusted character lookup and a weight capacity in grams.
- registerItem defines project-owned item IDs, names, weights, stack limits and transferability.
- mint requires a trusted Principal with the inventory.mint capability.
- consume requires authenticated ownership of the source character.
- transfer validates source ownership, transferability, destination capacity, available quantity and stack bounds.
- getCount, getWeight and list offer deterministic inventory reads.
- getLedger exposes immutable receipt snapshots.
- Mutations support unique request IDs and reject conflicting idempotency-key reuse.

All actions use integer item quantities and integer gram weights. Every item has **one aggregated stack per character** in this deliberately limited prototype; individual serial-numbered items, nested containers and per-slot inventories are **not implemented**.

## Trust, persistence and concurrency

The caller-provided Principal and character resolver are trusted server-side dependencies. **Never build a principal from untrusted client JSON** or expose mint as a client-authorized operation.

Everything in this reference runs in one JavaScript process. Its item registry, stocks, receipts and request IDs disappear on restart. F2 separately delivers the additive PostgreSQL schema, authenticated transactional service and repository, idempotency, immutable movement receipts, authorization and capacity enforcement; the final PR #59 head [CI #227](https://github.com/smouj/calm-rp-framework/actions/runs/46014326377) and post-merge `main` [CI #228](https://github.com/smouj/calm-rp-framework/actions/runs/46014689610) passed PostgreSQL 17. This in-memory reference is not wired to that persistent service and is not a production ledger. See [`PersistentInventoryService`](../../packages/core/src/persistent-inventory-service.ts), [`PgInventoryRepository`](../../packages/persistence/src/inventory.ts) and [ADR-0008](../adr/0008-persistent-inventory-containers.md).

A future game adapter must project server-owned inventory state to an authorized runtime and only accept client intents. There is currently **no publicly supported GTA VI inventory native**, networking contract, game hook or legal permission assumed here.

## Relevant public references

- Cfx server event security (existing GTA V ecosystem): https://docs.fivem.net/docs/developers/server-security/
- Qbox server exports (existing GTA V ecosystem): https://docs.qbox.re/resources/qbx_core/exports/server
- Rockstar RP server policies: https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers
- Runtime verification gates: ../server/RUNTIME_REQUIREMENTS.md

Do not equate this project's methods with documented GTA VI functions.
