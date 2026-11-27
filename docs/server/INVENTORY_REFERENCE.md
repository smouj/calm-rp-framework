# Portable inventory reference — review branch

**Status:** in-memory development reference, not a production service or GTA VI integration.

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

Everything in this reference runs in one JavaScript process. Its item registry, stocks, receipts and request IDs disappear on restart. The F2 design now defines additive PostgreSQL tables for item definitions, generalized containers, stacks, idempotency and immutable movement receipts, but this reference is not wired to those tables. The persistent repository and authenticated service still need to implement transaction locking, authorization, atomic stock changes, capacity enforcement under concurrency, and reconnect/retry behavior. The in-memory receipt log is not a production ledger.

A future game adapter must project server-owned inventory state to an authorized runtime and only accept client intents. There is currently **no publicly supported GTA VI inventory native**, networking contract, game hook or legal permission assumed here.

## Relevant public references

- Cfx server event security (existing GTA V ecosystem): https://docs.fivem.net/docs/developers/server-security/
- Qbox server exports (existing GTA V ecosystem): https://docs.qbox.re/resources/qbx_core/exports/server
- Rockstar RP server policies: https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers
- Runtime verification gates: ../server/RUNTIME_REQUIREMENTS.md

Do not equate this project's methods with documented GTA VI functions.
