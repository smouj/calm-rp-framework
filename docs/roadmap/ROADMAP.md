# Roadmap

## P0 — Foundation

- Monorepo, lint/typecheck/test gates
- Core identifiers and contracts
- Simulator boundary
- PostgreSQL/Redis local infrastructure
- Threat model and ADR discipline

## P1 — First vertical slice

- account + character lifecycle
- authoritative session model
- ledger-based wallet/bank transfers
- immutable audit events
- simulator end-to-end tests

Exit: two simulated players can transact through commands without game-specific code.

## P2 — Inventory and ownership

- item definitions
- containers and capacity
- metadata/durability/serials
- transactional transfers
- ownership invariants

## P3 — RP systems

- jobs and factions
- vehicles and garages
- properties and access
- police/EMS domain modules
- phone/communications contracts

## P4 — Cfx compatibility lab

Use only public Cfx.re APIs to validate adapter design. Do not move FiveM assumptions into the domain.

## P5 — GTA VI integration

Blocked until a legitimate public development/runtime contract exists. At that point:

1. capture official capabilities,
2. write an ADR,
3. implement adapter conformance tests,
4. bind runtime events to existing domain commands,
5. benchmark synchronization and authority boundaries.
