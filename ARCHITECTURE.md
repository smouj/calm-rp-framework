# Architecture — CALM Essentials

## Purpose

Develop **CALM Essentials**: reusable, verifiable roleplay systems as an open-source framework — the base a roleplay server needs — with GTA VI integration as a long-term goal contingent on public, legitimate runtime documentation.

The architecture is not a functioning FiveM replacement today, and that is deliberate: it must remain useful even if GTA VI never receives an authorized community-server API.

## Architectural posture

### Portable, server-authoritative domain

The game client is untrusted. Persistent RP state belongs in domain/application services: accounts, characters, economy, inventory, jobs, organizations, property, vehicles, police records and permissions. Clients and adapters communicate _intent_, not authoritative balances or ownership.

```text
client / simulator input
    -> parse
    -> authenticate (trusted context)
    -> authorize
    -> validate
    -> transact / persist
    -> audit / project result
```

### Two registers: RP functions vs game functions

Original operations we can implement and test now (characters, economy, inventory, jobs, permissions) are kept strictly separate from game integrations that exist only as future authorized interfaces. Design work is informed by verified GTA VI mechanics research ([observations](./docs/research/GTA6_RP_MECHANICS_2026-11-25.md)) for data modeling — never for assumed APIs.

### Modular monolith first

A framework does not need a microservice platform. Start with a modular deployable application and stable contracts; introduce extension APIs, brokers, external plugins or multi-region infrastructure only after tested use cases justify their cost.

### Game-independent ports and adapters

```text
apps -> packages/contracts -> packages/core + packages/modules/*
  |            ^                        ^
  v            |                        |
adapters ------+------------------------+
```

`packages/*` must not import runtime globals, GTA natives, Cfx natives, adapter implementations or proprietary asset formats.

## Target module layout (introduced progressively)

```text
calm-rp-framework/
├── packages/
│   ├── core/            # shared primitives and rules
│   ├── contracts/       # public service contracts and events
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

Empty folders are not created ahead of code. Each module lands as a complete unit. The proposed public service surface (session/character/economy/inventory/jobs/permissions/hooks, mapped against documented ESX/QBCore/Qbox equivalents) is specified in the [service-contracts proposal](./docs/architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md).

## Current implementation (audited 2026-11-25)

- `packages/core`: base types, domain errors, money primitives, characters, ledger, inventory rules (in-memory).
- `packages/contracts`: typed envelopes, domain events, runtime capability and session contracts.
- `adapters/simulator`: deterministic two-character scenario with transfers; a fuller RP cycle is pending.
- `apps/api`: health-status scaffold.
- `infrastructure/database`: initial SQL migration (accounts, characters, financial movements); the balanced-ledger invariant is not yet enforced by a transactional service.
- `adapters/cfx`: FiveM/RedM ecosystem research only, **not** GTA VI integration.
- `adapters/gta6`: intentionally reserved and **not implemented**.

Known technical debts to resolve in Phase F1: enforce balanced financial transactions at the service layer; unify the string-versus-UUID identifier representation between in-memory models and PostgreSQL.

## Persistence and security

PostgreSQL is the planned durable source of truth. Redis, if used, only stores rebuildable ephemeral state. Money uses integer minor units; changes affecting money, inventory or ownership require transactions, idempotency and auditability. Object ownership is modeled independently of an item's physical location (person, vehicle container, warehouse, property), and vehicles are persistent entities (owner, access permissions, state) distinct from any transient in-game representation.

Admin operations must pass the same domain invariants with explicit, attributable privileges. Client-reported state is always untrusted.

## Community extension strategy

The framework may evolve toward versioned module contracts and a dependency-aware module manifest — but no public plugin ABI, scripting API, server network protocol or FiveM compatibility is specified today. The extension system will be formalized only after two independent modules are proven to communicate through public services; each module keeps control of its own tables and accesses others through defined interfaces (the Qbox-recommended discipline). Proposals need a real use case, stable naming, migration/compatibility rules, tests and an ADR.

Reference implementations and sample scenarios are **examples**, not proof of GTA VI runtime readiness. Documentation labels these maturity levels explicitly.

## GTA VI and other runtime research

The GTA VI adapter is blocked until an implementable and authorized first-party path establishes the relevant capabilities, including authentication, lifecycle, scripting, client/server events, entities and policy. Before integration, update platform research, `RT-*` requirement states, ADRs and conformance tests.

PC-execution research (VIctory, XCL, forks) demonstrates rendering experiments, not multiplayer or scripting interfaces; VIctory is offline by design. Cfx/FiveM concepts and RAGE 9 file-format observations may inspire design but may never be silently promoted to GTA VI guarantees. No proprietary game data belongs in this repository.

## Project evolution

- Preserve the boundary between portable rules and game APIs.
- Prefer additive, versioned contracts and explicit migrations.
- Migrate `@gta6-rp/*` package names to CALM-owned names only in a separately versioned change with deprecation aliases and migration tests.
- Keep reviews and security gates visible to outside contributors.
- Avoid runtime claims until public evidence and reproducible integration tests exist.
- Follow the accepted [ADR-0007](./docs/adr/0007-calm-essentials-framework-scope.md) for the CALM Essentials framework scope.
