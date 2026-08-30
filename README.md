# GTA VI RP Platform

Private, game-agnostic foundation for a future GTA VI roleplay platform.

> **Status:** pre-platform architecture. GTA VI community-server APIs and scripting contracts are not assumed until Rockstar Games / Cfx.re publish them.

## Goals

- Build the roleplay domain independently from any specific GTA runtime.
- Keep gameplay authority on the server side.
- Isolate game-specific integration behind adapters.
- Make core systems testable without launching the game.
- Prepare a clean path from current Cfx.re concepts to a future GTA VI integration.
- Treat security, observability, migrations and operational tooling as first-class concerns.

## Planned architecture

```text
apps/
  api/                 HTTP/internal services
  game-server/         runtime composition layer
  nui/                 in-game web UI shell
  web-admin/           administration console
packages/
  core/                shared domain primitives
  characters/          identity and character lifecycle
  economy/             accounts, ledger and transactions
  inventory/           items, containers and ownership
  jobs/                jobs and progression
  factions/            organizations and memberships
  vehicles/            ownership and persistence
  housing/             properties and access
  police/              records, warrants and evidence
  contracts/           typed messages/events
  shared/              cross-cutting utilities
adapters/
  cfx/                 current Cfx.re compatibility experiments
  simulator/           local test/runtime adapter
  gta6/                reserved future GTA VI adapter
infrastructure/
  database/            migrations and persistence assets
  docker/              local infrastructure
  monitoring/          observability configuration
docs/
  architecture/        architecture documentation
  adr/                 architecture decision records
  security/            threat model and security guidance
tools/                  repository tooling
tests/                  cross-package and integration tests
```

## Technology direction

- **TypeScript** for domain packages, backend services, tooling and web UI.
- **Lua / CfxLua** only inside runtime adapters where appropriate.
- **PostgreSQL** as the primary durable data store.
- **Redis** for ephemeral coordination/cache where justified.
- **pnpm workspaces** for the TypeScript monorepo.
- **Docker Compose** for local infrastructure.
- **GitHub Actions** for validation and CI.

## Core rule

The domain must never depend directly on GTA natives, FiveM globals, browser globals or transport-specific APIs. Platform-specific code belongs in an adapter.

```text
Domain / use cases
       ↓ ports
Platform adapters
       ↓
Cfx.re today / GTA VI future / simulator
```

## Development status

The repository is intentionally being initialized before an official GTA VI community-server development contract exists. Any GTA VI integration code must therefore remain an explicit placeholder until supported by public documentation.

## Legal / project note

This is an independent technical project. It is not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re. No proprietary game assets or leaked/non-public materials belong in this repository.
