# GTA VI RP Platform

Private, game-agnostic foundation for a future GTA VI roleplay platform.

> **Status:** pre-platform architecture. No GTA VI community-server API, native, scripting runtime or unofficial reverse-engineered contract is assumed.

## Mission

Build the roleplay platform now while keeping the game runtime replaceable later. Domain rules, persistence, security and tooling must remain usable whether the eventual integration is Cfx.re-based, Rockstar-provided, or something else.

## Principles

1. **Server authoritative.** Clients request actions; the server validates and commits state.
2. **Game agnostic core.** Domain code cannot import GTA/FiveM natives or browser/runtime globals.
3. **Ports and adapters.** Game integration lives behind explicit adapter boundaries.
4. **Ledger-first economy.** Financial state is auditable and transactional.
5. **Security by default.** Trust boundaries and abuse cases are designed before features ship.
6. **Observable operations.** Logs, metrics, migrations and deployment concerns are first-class.
7. **No invented GTA VI API.** `adapters/gta6` remains a placeholder until public documentation exists.

## Repository layout

```text
apps/
  api/                 transport/API composition
packages/
  core/                domain primitives
  contracts/           typed commands/events
adapters/
  simulator/           deterministic local runtime
  cfx/                 current Cfx.re compatibility research boundary
  gta6/                reserved future GTA VI adapter
infrastructure/
  database/            schema migrations
  docker/              local PostgreSQL + Redis
docs/
  adr/                 architecture decisions
  architecture/        boundaries and design rules
  roadmap/             phased delivery plan
  security/            threat model
.github/                CI, ownership, issue/PR templates, Dependabot
```

## Technology direction

- TypeScript for domain packages, services, tooling and web-facing systems.
- Lua/CfxLua only inside Cfx runtime adapters when needed.
- PostgreSQL for durable state and transactional records.
- Redis for ephemeral coordination/cache only where justified.
- pnpm workspaces for the monorepo.
- Docker Compose for local infrastructure.
- GitHub Actions for validation.

## Getting started

Requirements: Node.js 22+, pnpm 10+, and Docker for local infrastructure.

```bash
pnpm install
cp .env.example .env
docker compose -f infrastructure/docker/compose.yml up -d
pnpm check
```

## Architecture rule

```text
UI / Game Client
      |
      | untrusted requests
      v
Application / Domain
      |
      | validated ports
      v
Infrastructure + Game Adapter
      |
      +--> Simulator
      +--> Cfx.re compatibility layer
      `--> GTA VI adapter (future, official contract only)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md), [the roadmap](./docs/roadmap/ROADMAP.md), and [the threat model](./docs/security/THREAT_MODEL.md).

## Legal / project note

Independent technical project. Not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re. Proprietary game assets, leaked materials and non-public APIs do not belong in this repository.
