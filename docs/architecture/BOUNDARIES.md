# Dependency Boundaries

**State:** ACTIVE

These boundaries keep the future RP server maintainable while the GTA VI runtime remains unknown.

They are architectural constraints, not suggestions.

## Dependency direction

```text
apps
  |
  v
packages/contracts
  |
  v
packages/core

adapters ---------> packages/contracts + packages/core
infrastructure ---> application/domain ports
```

The dependency direction points toward stable domain contracts. Runtime-specific code depends on the domain; the domain never depends on the runtime.

## Allowed dependencies

```text
apps -> packages/*
adapters -> packages/*
packages/contracts -> packages/core
feature/domain package -> packages/core + packages/contracts
infrastructure composition -> declared application/domain ports
```

Allowed does not mean required. Prefer the smallest dependency surface that expresses the capability.

## Forbidden dependencies

```text
packages/* -> adapters/*
packages/* -> GTA/FiveM/Cfx natives
packages/* -> NUI/browser runtime globals
packages/* -> undocumented GTA VI APIs
one domain module -> another module's persistence tables/repository implementation
core domain -> Redis/cache assumptions
core domain -> HTTP/framework request objects
```

A type alias around a runtime-specific native does not make the dependency game-agnostic.

## Authority boundary

Adapters and clients may provide **intent and observations**. They do not own canonical RP state.

Examples of canonical state that belongs behind server/domain authority:

- account/character identity mapping;
- money and ledger history;
- inventory and item ownership;
- property and vehicle ownership;
- jobs, factions, grades and permissions;
- justice/moderation records;
- configuration that changes authoritative gameplay rules.

Transient game entity handles, rendering state, current voice proximity and short-lived input state are adapter/runtime concerns unless a domain requirement explicitly says otherwise.

## Cross-module communication

Modules should communicate through explicit commands, queries, events or application services.

Avoid:

- importing another module's internal repository;
- querying another module's tables directly;
- mutating another aggregate in the same handler without an explicit transaction/use-case boundary;
- using a shared “utils” package as an unreviewed dependency escape hatch.

When two modules repeatedly require each other's internals, reassess the boundary instead of adding circular abstractions.

## Persistence boundary

PostgreSQL is the planned durable store, but domain invariants must not be encoded only as incidental SQL behavior.

- repositories expose domain-oriented operations;
- migrations define schema evolution;
- transactions preserve multi-record invariants;
- Redis/cache data is rebuildable;
- direct operational SQL is not an application feature path.

## Runtime adapter contract

An adapter translates between a runtime and application contracts:

```text
runtime event
  -> parse / normalize
  -> authenticate/session resolve
  -> application command
  -> domain validation + transaction
  -> result/domain event
  -> runtime projection
```

Adapter code may reject malformed runtime input before the application layer, but it may not bypass domain authorization or invent persistent state.

## GTA VI-specific gate

Before any real GTA VI runtime dependency is introduced:

1. the capability is `CONFIRMED` in `docs/research/PLATFORM_STATUS.md`;
2. the relevant row in `docs/server/RUNTIME_REQUIREMENTS.md` is updated;
3. durable coupling is documented in an ADR;
4. conformance tests exist at the adapter boundary;
5. game-specific types remain outside the core domain.

## Review checklist

For every new dependency ask:

1. Could this code still be unit-tested if the game runtime disappeared?
2. Is the dependency on a stable project contract or on an implementation detail?
3. Does this introduce a second source of truth for durable state?
4. Can a player-controlled value cross this boundary without server validation?
5. Is a current FiveM/Cfx assumption being treated as if it were a GTA VI guarantee?
6. Would the dependency force unrelated modules to deploy or migrate together without a real invariant requiring it?

If the answer exposes runtime coupling, authority leakage or hidden cross-module access, redesign the boundary before merging.
