# Architecture — Community RP Platform

## Purpose

Develop reusable and verifiable roleplay systems as an **open-source foundation**, with GTA VI integration as a long-term goal contingent on public, legitimate runtime documentation.

The architecture is not a functioning FiveM replacement today. It must remain useful even if GTA VI never receives an authorized community-server API.

## Architectural posture

### Portable, server-authoritative domain

The game client is untrusted. Persistent RP state belongs in domain/application services: accounts, characters, economy, inventory, jobs, permissions and property ownership. Clients and adapters communicate _intent_, not authoritative balances or ownership.

```text
client / simulator input
    -> parse
    -> authenticate
    -> authorize
    -> validate
    -> transact / persist
    -> audit / project result
```

### Modular monolith first

Multiple contributors and potential future server communities do not require a microservice platform at this stage. Start with a modular deployable application and stable contracts. Introduce extension APIs, brokers, external plugins, multi-region infrastructure or a server browser only after tested use cases justify their cost.

### Game-independent ports and adapters

```text
apps -> packages/contracts -> packages/core
  |            ^                  ^
  v            |                  |
adapters ------+------------------+
```

`packages/*` must not import runtime globals, GTA natives, Cfx natives, adapter implementations or proprietary asset formats.

## Current implementation

- `packages/core`: base types, domain error and money primitives.
- `packages/contracts`: typed envelopes and domain-event interfaces.
- `adapters/simulator`: a basic, deterministic player directory.
- `apps/api`: health-status scaffold.
- `infrastructure/database`: initial SQL migration; `infrastructure/docker`: development services.
- `adapters/cfx`: current FiveM/RedM ecosystem research, **not** proven GTA VI integration.
- `adapters/gta6`: intentionally reserved and **not implemented**.

Neither a game client, networking stack, plugin marketplace nor a playable RP server exists yet.

## Persistence and security

PostgreSQL is the planned durable source of truth. Redis, if used, only stores rebuildable ephemeral state. Money uses integer minor units; changes affecting money, inventory or ownership require transactions, idempotency and auditability.

Admin operations must pass the same domain invariants with explicit, attributable privileges. Client-reported state is always untrusted.

## Community extension strategy

The project may evolve toward reusable packages and resource contracts, but no public plugin ABI, scripting API, server network protocol or FiveM compatibility is specified today. Proposals need a real use case, stable naming, migration/compatibility rules, tests and an ADR.

Reference implementations and sample servers are **examples**, not proof of GTA VI runtime readiness. Documentation should clearly label these maturity levels.

## GTA VI and other runtime research

The GTA VI adapter is blocked until an implementable and authorized first-party path establishes the relevant capabilities, including authentication, lifecycle, scripting, client/server events, entities and policy. Before integration, update platform research, `RT-*` requirement states, ADRs and conformance tests.

Cfx/FiveM concepts and Leonida's public file-format observations may inspire design but may never be silently promoted to GTA VI guarantees. No proprietary game data belongs in this repository.

## Project evolution

- Preserve the boundary between portable rules and game APIs.
- Prefer additive, versioned contracts and explicit migrations.
- Keep reviews and security gates visible to outside contributors.
- Avoid runtime claims until public evidence and reproducible integration tests exist.
- Follow the accepted [ADR-0006](./docs/adr/0006-community-open-platform.md) for the community-platform scope.
