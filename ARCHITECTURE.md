# Architecture

## Objective

Build RP systems that survive a future change in the game integration layer.

## Dependency direction

```text
apps -> packages/contracts -> packages/core
  |            ^                  ^
  v            |                  |
adapters ------+------------------+
```

`packages/*` must never depend on `adapters/*` or game-specific globals.

## Trust model

The game client is untrusted. A client may express intent but may not authoritatively set money, inventory, permissions, ownership, health-related RP state, job rank or persisted world state.

Every state-changing command follows:

```text
request -> authenticate -> authorize -> validate -> transact -> persist -> emit event -> project response
```

## Domain boundaries

Initial bounded contexts:

- identity / characters
- economy / ledger
- inventory / containers
- jobs / progression
- factions / memberships
- vehicles / ownership
- properties / access
- police / justice records
- communications / phone

Boundaries communicate through typed contracts rather than direct database table access.

## Adapters

### Simulator

Deterministic local adapter used to develop and test domain behavior without a game runtime.

### Cfx

Compatibility and research boundary for public FiveM/Cfx.re concepts. It must not leak natives into the domain.

### GTA VI

Reserved adapter. No implementation may claim support until an official/public contract exists.

## Persistence

PostgreSQL is the durable source of truth. Redis is non-authoritative and may be discarded/rebuilt without losing canonical state.

Financial values are stored as integer minor units. Ledger entries are immutable after commit; corrections are compensating transactions.

## Evolution rule

Prefer additive contracts, explicit migrations and architecture decision records. Breaking cross-context changes require an ADR.
