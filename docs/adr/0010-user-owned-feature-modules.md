# ADR 0010 — User-owned, namespaced CALM feature modules

- **Status:** Accepted as product direction; implementation and runtime format remain undecided
- **Date:** 2026-11-27
- **Related:** [ADR-0009 — GTA VI-first product scope](./0009-gta-vi-first-product-scope.md), [service-contract proposal](../architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md), [dependency boundaries](../architecture/BOUNDARIES.md)

## Context

The project owner wants to build roleplay features as separately named scripts/modules, for example `smj_character` and `smj_money`. Each should have a clear responsibility and be independently understandable, maintained and eventually versioned. CALM is the framework and shared foundation for those features; it should not become one large feature script or reproduce ESX/QBCore APIs and GTA V resource conventions.

The desired target is GTA VI. There is not yet a verified, authorized GTA VI resource loader, scripting API or module manifest to implement against. The examples below express CALM's product architecture and naming direction only.

## Decision

1. **Separate the framework from feature modules.** CALM owns the shared contracts, security rules and composition of its roleplay system. Feature modules implement cohesive domains such as character identity, money, inventory, jobs or vehicles.
2. **Use the owner's `smj_` namespace for authored module IDs.** `smj_character` and `smj_money` are representative names. The prefix identifies project-owner modules; it is not a Rockstar identifier, a game-recognized resource name or a promise of a particular packaging format.
3. **Give each module clear ownership.** A module owns its domain rules, public operations, validation, persistence changes and documentation. Other modules call its declared CALM contract; they do not import its internals, mutate its records directly or query its tables.
4. **Keep shared capabilities in CALM contracts.** Cross-module identity, authorization, typed operations and events are CALM-owned interfaces. For example, `smj_money` may refer to a character through a CALM `CharacterId` contract, while it retains ownership of accounts and the ledger.
5. **Do not copy another game's loader or ABI.** The analogy to roleplay “scripts” describes modular feature delivery. It does not select FiveM/Cfx manifests, Lua, native calls, event names, client/server transport or any other GTA V runtime behavior for GTA VI.
6. **Keep current boundaries honest.** Today, these are design/package boundaries inside CALM's existing TypeScript modular monolith and simulator. Dynamic loading, standalone deployment, a public third-party resource ABI and a game-facing adapter remain deferred. A future GTA VI adapter requires a documented, authorized interface and the gates in ADR-0009.

## Example module split

| Module ID | Owns | May use through CALM contracts |
| --- | --- | --- |
| `smj_character` | Character profiles, character lifecycle and its persistence | CALM authentication/session and permission contracts |
| `smj_money` | Accounts, balances, transfers and an auditable ledger | CALM character identity and authorization contracts |

These examples are design illustrations, not claims that the modules or a runtime loader already exist. Prove cross-module calls and data ownership with real CALM modules before stabilizing a published extension ABI, as described in the service-contract proposal.

## Consequences

- New domain work should state which module owns each rule and record before adding cross-domain behavior.
- The existing CALM code and package structure need not be renamed to `smj_*` in this decision. Any public package-name migration remains a separate, versioned change.
- Documentation must describe gameplay evidence, CALM-owned module behavior and game-runtime integration as distinct things.
- No gameplay feature is called GTA VI-compatible until it conforms to a verified, authorized GTA VI runtime contract.

## Revisit when

- Two implemented modules demonstrate stable CALM service contracts and dependency handling; or
- Rockstar publishes an authorized GTA VI scripting or community-server interface, at which point a separate ADR can evaluate its exact packaging, language, lifecycle and security model.
