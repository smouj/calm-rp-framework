# Architecture — CALM Essentials

## Purpose

Develop **CALM Essentials**: original roleplay systems designed for GTA VI's publicly observable mechanics and CALM's intended GTA VI RP community. The target is GTA VI; the simulator and domain boundaries let us verify CALM's rules before an authorized game runtime exists.

The project does not implement a GTA VI mod, client, multiplayer server or PC compatibility layer. Rockstar's published game is a single-player experience; GTA VI multiplayer and runtime integration remain unknown. CALM must not claim compatibility until a documented, authorized interface exists.

## Architectural posture

### GTA VI-targeted, server-authoritative RP domains

CALM owns the persistent RP state for its target design: accounts, characters, economy, carried and stored items, jobs, organizations, property, vehicles, police records and permissions. The simulator validates these target-specific rules. **The game client is untrusted**: a future client communicates _intent_, not authoritative balances or ownership.

```text
client / simulator input
    -> parse
    -> authenticate (trusted context)
    -> authorize
    -> validate
    -> transact / persist
    -> audit / project result
```

### Two registers: GTA VI RP behavior vs runtime capabilities

CALM's GTA VI-targeted RP behavior (characters, economy, carried/stored inventory, jobs, permissions) is specified separately from client/server integration. Design work is informed by evidence-graded GTA VI mechanics research ([observations](./docs/research/GTA6_RP_MECHANICS_2026-11-25.md)); it does not invent engine APIs or derive implementation contracts from leaked internals.

### Modular monolith first

CALM does not need a microservice platform. Start with a modular deployable application and stable contracts; introduce extension APIs, brokers, external plugins or multi-region infrastructure only after tested GTA VI RP workflows justify their cost.

### Target model, simulator and blocked runtime adapter

```text
apps -> packages/contracts -> packages/core + packages/modules/*
  |            ^                        ^
  v            |                        |
adapters ------+------------------------+

infrastructure/persistence -> domain ports declared by packages/core
```

`packages/*` must not import runtime globals, GTA natives, Cfx natives, adapter implementations or proprietary asset formats. This boundary enables safe simulation of CALM's GTA VI-targeted rules; it does not make another game a product target.

## Target module layout (introduced progressively)

```text
calm-rp-framework/
├── packages/
│   ├── core/            # CALM GTA VI RP rules and services
│   ├── contracts/       # CALM service contracts and events
│   └── modules/          # one folder per RP domain, each arriving
│       ├── characters/   # with code + contracts + tests + docs
│       ├── economy/
│       ├── inventory/
│       ├── jobs/
│       ├── organizations/
│       ├── vehicles/
│       ├── properties/
│       ├── police/
│       └── medical/
├── adapters/
│   ├── simulator/        # reproducible RP test environment
│   └── gta6/            # reserved; BLOCKED
├── apps/
│   ├── api/
│   └── admin/           # future
├── infrastructure/
│   └── database/
├── tests/
├── docs/
└── site/
```

Empty folders are not created ahead of code. Each module lands as a complete unit for a concrete CALM GTA VI RP workflow. A general third-party plugin ABI is not a current goal. The [service-contracts proposal](./docs/architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md) defines CALM-owned boundaries; it does not promise compatibility with external frameworks.

## Current implementation (audited 2026-11-27, updated during F2)

- `packages/core`: base types, domain errors, money primitives, canonical UUID identifiers, authenticated-session service, persistent character service, double-entry ledger service, inventory rules (in-memory reference stores included for each).
- `packages/contracts`: typed envelopes, domain events, runtime capability and session contracts.
- `packages/persistence`: driver-neutral SQL session (production `pg` pool + embedded-PostgreSQL verification engine), additive migration runner, PostgreSQL repositories for accounts, sessions, characters, financial accounts and the ledger.
- `adapters/simulator`: deterministic two-character scenario with transfers; a fuller RP cycle is pending.
- `apps/api`: health-status scaffold.
- `infrastructure/database`: three additive migrations (bootstrap; sessions and ledger guards; append-only ledger history).
- `adapters/cfx`: FiveM/RedM ecosystem research only, **not** GTA VI integration.
- `adapters/gta6`: intentionally reserved and **not implemented**.

Both technical debts recorded for Phase F1 are resolved: balanced financial transactions are enforced by the ledger service (domain validation, in-transaction balance re-derivation and the deferred constraint trigger), and identifiers are unified on the canonical UUID form across domain types and database columns.

## Persistence and security

PostgreSQL is the planned durable source of truth. Redis, if used, only stores rebuildable ephemeral state. Money uses integer minor units; changes affecting money, inventory or ownership require transactions, idempotency and auditability. Object ownership is modeled independently of an item's physical location (person, vehicle container, warehouse, property), and vehicles are persistent entities (owner, access permissions, state) distinct from any transient in-game representation.

Admin operations must pass the same domain invariants with explicit, attributable privileges. Client-reported state is always untrusted.

## Community extension strategy

CALM may add internal module boundaries when a real GTA VI RP workflow needs them. It does not currently promise a public plugin ABI, scripting API, server network protocol or FiveM compatibility. Any externally executable module system requires a concrete authorized GTA VI runtime, a threat model, license review, compatibility rules, tests and an ADR.

Reference implementations and sample scenarios are **examples**, not proof of GTA VI runtime readiness. Documentation labels these maturity levels explicitly.

## GTA VI and other runtime research

The GTA VI adapter is blocked until an implementable and authorized first-party path establishes the relevant capabilities, including authentication, lifecycle, scripting, client/server events, entities and policy. Before integration, update platform research, `RT-*` requirement states, ADRs and conformance tests.

Detailed reports about unofficial PC execution, reverse-engineering tools and external framework internals are maintained in a separate documentary repository. They are not CALM architecture inputs or dependencies. CALM's GTA VI adapter remains blocked until a public, authorized runtime contract is documented; no proprietary or leaked game data belongs in this repository.

## Project evolution

- Keep CALM's GTA VI RP requirements explicit and isolate them from unknown game APIs.
- Prefer additive, versioned contracts and explicit migrations.
- Migrate `@gta6-rp/*` package names to CALM-owned names only in a separately versioned change with deprecation aliases and migration tests.
- Keep reviews and security gates visible to outside contributors.
- Avoid runtime claims until public evidence and reproducible integration tests exist.
- Follow [ADR-0009](./docs/adr/0009-gta-vi-first-product-scope.md) for the current CALM target and evidence limits.
