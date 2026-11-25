# ADR 0007 — CALM Essentials: roleplay-framework scope

- **Status:** Accepted (directed by the repository owner, 2026-11-25)
- **Date:** 2026-11-25
- **Supersedes:** the FiveM-like _platform_ ambition in [ADR-0006](./0006-community-open-platform.md); retains ADR-0006's open-source, community and governance direction, [ADR-0003](./0003-modular-monolith-first.md)'s modular-monolith architecture, and the blocked GTA VI adapter of [ADR-0001](./0001-game-agnostic-core.md)
- **Evidence base:** [GTA6_CAPABILITY_MATRIX_2026-11-25.md](../research/GTA6_CAPABILITY_MATRIX_2026-11-25.md), [ARCHITECTURE_COMPARISON_2026-11-25.md](../research/ARCHITECTURE_COMPARISON_2026-11-25.md), [GTA6_EXECUTION_PROGRESS_2026-11-25.md](../research/GTA6_EXECUTION_PROGRESS_2026-11-25.md) and the owner's 25 November 2026 technical research

## Context

ADR-0006 framed the long-term ambition as an open community **platform** "similar in scope to FiveM". The verified research of 24–25 November 2026 shows:

1. No public, authorized GTA VI resource-execution API exists (all 22 `RT-*` requirements remain UNKNOWN; see the [execution-progress research](../research/GTA6_EXECUTION_PROGRESS_2026-11-25.md) — PC execution projects such as VIctory/XCL do not provide one either).
2. The RP ecosystem's proven product class is the **roleplay framework**: ESX Legacy, QBCore and Qbox supply characters, economy, inventory, jobs, permissions and extensions to servers, not the multiplayer platform itself.
3. The market rewards game-agnostic RP infrastructure (QBCore's organization moved to the engine-agnostic Mantle platform), which is exactly CALM's lane.

The owner's research concluded that building the base systems a roleplay server needs — characters, economy, inventory, jobs, organizations, properties, vehicles, permissions and extensions — is the viable, verifiable goal today.

## Decision

1. The working product name is **CALM Essentials**: an original, open-source roleplay **framework** in the ESX/QBCore product class. The repository name `calm-rp-framework`, the `@gta6-rp/*` package scopes and the CALM brand identity are unchanged in this decision; migrating identifiers is a separately versioned change (see below).
2. CALM Essentials is **not** a server platform: hosting, a server browser, a multiplayer network runtime, client downloads and a plugin marketplace stay out of scope. ADR-0006's exclusions remain in force.
3. Two registers are kept strictly separate:
   - **RP functions** — original operations we can implement and test now (characters, economy, inventory, jobs, permissions, persistence);
   - **game functions** — integrations developed only when legitimate, verified interfaces exist.
4. ESX/QBCore/Qbox are **design references only**. Their cores are GPL-licensed; CALM is MIT. We study concepts and write original implementations; any specific reuse requires a documented license-compatibility review.
5. Domain modules are introduced progressively (characters, economy, inventory, jobs, organizations, vehicles, properties, police, medical) — each with code, contracts, tests and documentation, not empty folders.
6. GTA VI research influences **data modeling** (see the [RP mechanics observations](../research/GTA6_RP_MECHANICS_2026-11-25.md)): ownership independent of physical location, vehicles as persistent entities, police records built on incidents and evidence. It never supplies assumed APIs, native names, addresses or signatures.

## Consequences

- Documentation, READMEs, roadmap, architecture overview and the community site are updated to the CALM Essentials framing in the same change batch (roadmap Phases F0–F5).
- The GTA VI adapter remains **BLOCKED**; no `RT-*` requirement is promoted.
- The deferred decisions recorded here:
  - **Identifier migration** (`@gta6-rp/*` → CALM-owned names): to be done as a versioned, deprecation-aliased change with dependency migration tests, before the persistence phase stabilizes public contracts; do not break existing contracts gratuitously.
  - **Public extension/module system**: formalize only after two independent modules are proven to communicate through public services (see the [service-contracts proposal](../architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md)).
- ADR-0002 remains historical; ADR-0006's governance, licensing and security gates remain active.

## Revisit when

- A public, authorized GTA VI integration pathway is verified (then re-evaluate F5 and the adapter contract), or
- real module consumers demand published, versioned extension contracts earlier than planned.
