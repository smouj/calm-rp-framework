# Architecture

## Objective

Prepare the technical foundation for **one future GTA VI roleplay server/community of our own** while keeping every unknown GTA VI integration detail isolated.

The architecture exists to reduce future rework, not to pre-build a FiveM replacement or a generic hosting platform.

## Architectural posture

### Modular monolith by default

Start with one deployable authoritative application split into strict modules. Do not introduce microservices, event brokers, distributed caches or multi-region topology without a measured operational requirement.

### Single-server first

The primary product boundary is our RP server. Reusability is desirable inside the codebase, but public framework compatibility is not a design objective.

### Game runtime as an external dependency

GTA/FiveM/Cfx-specific behavior belongs only in adapters. The domain remains useful even if the eventual GTA VI integration model differs completely from FiveM.

## Dependency direction

```text
apps -> packages/contracts -> packages/core
  |            ^                  ^
  v            |                  |
adapters ------+------------------+
```

`packages/*` must never depend on `adapters/*`, GTA natives, Cfx natives, browser globals or undocumented game/runtime APIs.

## Trust model

The game client is untrusted. A client may express intent but may not authoritatively set money, inventory, permissions, ownership, job rank, persisted character state or canonical world state.

Every state-changing command follows:

```text
request -> authenticate -> authorize -> validate -> transact -> persist -> emit audit/event -> project response
```

## Initial server domains

These are planning boundaries for the future server, not commitments to separate services:

- accounts / sessions
- identity / characters
- economy / ledger
- inventory / containers
- jobs / progression
- factions / memberships
- businesses / employment
- vehicles / ownership / garages
- properties / access
- police / justice records
- EMS / medical RP workflows
- communications / phone
- permissions / moderation / audit

Modules communicate through typed contracts rather than by reaching into each other's storage.

## Runtime adapters

### Simulator

Deterministic local adapter used to model and test server behavior without any game runtime. It is the main development target during the pre-runtime phase.

### Cfx compatibility lab

A research boundary for **public** FiveM/RedM/Cfx.re concepts when studying how current RP servers solve integration concerns. It is not evidence that GTA VI will use the same APIs or runtimes.

No Cfx native, event name, identifier format or resource assumption may become a core-domain requirement.

### GTA VI

Reserved future adapter. It remains intentionally empty until Rockstar Games and/or Cfx.re publish a legitimate public development/runtime contract that is relevant to GTA VI community servers.

Before implementing a capability here:

1. record the public source in `docs/research/PLATFORM_STATUS.md`;
2. write or update an ADR;
3. define the adapter contract;
4. add conformance tests;
5. verify that no GTA VI-specific assumption leaks into core modules.

## Persistence

PostgreSQL is the default durable source of truth for planned server state.

Redis is non-authoritative. It may be used later for ephemeral coordination, rate limits, presence or cache only when justified; deleting Redis must not destroy canonical player state.

Financial values use integer minor units. Ledger entries are immutable after commit; corrections use compensating transactions.

Ownership and inventory changes must be transactional and auditable.

## Deployment philosophy

Initial target:

```text
Game runtime / simulator
          |
          v
Authoritative RP application
          |
          +--> PostgreSQL
          |
          `--> optional Redis
```

Internal administration or web UI may exist as operational tooling, but a public GTA VI RP website is outside the project scope.

Scale-out architecture is deferred until actual runtime limits, player counts and platform constraints are known.

## Evolution rules

- Prefer additive contracts and explicit migrations.
- Breaking cross-module changes require an ADR.
- Unknown GTA VI details must be represented as unknown, not guessed.
- A current FiveM pattern may inform research but cannot silently become a GTA VI requirement.
- Production complexity must be justified by an observed need.
