# GTA VI RP Server Readiness

Private planning repository and technical foundation for a future **GTA VI roleplay server of our own**.

> **Status:** pre-runtime / research phase. This repository does not claim GTA VI multiplayer, community-server, scripting, modding or Cfx.re compatibility that has not been publicly documented.

## Purpose

The goal is to arrive prepared for the moment a legitimate GTA VI community-server/runtime path exists.

This repository is where we define, prototype and validate the parts of a serious RP server that do **not** need to depend on undocumented GTA VI internals: server rules, domain models, persistence, security, administration, economy, inventory, jobs, factions, emergency services, ownership, observability and adapter boundaries.

When Rockstar Games and/or Cfx.re publish the relevant GTA VI contracts, we should be able to integrate the game-facing layer without redesigning the entire server.

## Explicit non-goals

This project is **not** intended to become:

- a FiveM replacement;
- a generic public RP framework;
- a GTA VI modding SDK;
- a community-server browser or hosting platform;
- a public website dedicated to GTA VI RP;
- an implementation based on leaks, reverse-engineered private services or invented GTA VI APIs.

The target product is one well-designed RP server/community, not infrastructure for everybody else's servers.

## Current strategy

### 1. Design the server before the runtime

We can define today:

- character and identity lifecycle;
- economy and banking rules;
- inventory and ownership semantics;
- jobs, factions and businesses;
- police, EMS and justice workflows;
- vehicles, garages and properties;
- communications and phone contracts;
- permissions, moderation and auditing;
- persistence, backups and operational requirements;
- UI flows and prototypes that remain independent from the game adapter.

### 2. Keep the game boundary replaceable

```text
                         OUR RP SERVER

  rules / economy / inventory / jobs / factions / police / EMS
                              |
                              v
                   application contracts
                              |
                              v
                    game adapter boundary
                       /       |       \
                      /        |        \
              simulator    Cfx lab    GTA VI
                            research   future
```

The simulator lets us validate server behavior before a GTA VI runtime exists. The Cfx boundary is only a compatibility/research lab based on public FiveM/RedM concepts. `adapters/gta6` remains intentionally unimplemented until a legitimate public contract exists.

### 3. Prefer a modular monolith first

This repository is not a reason to invent production-scale infrastructure prematurely. The default architecture is a modular, server-authoritative application with PostgreSQL. Redis, extra services and horizontal scaling are introduced only when a measured requirement justifies them.

## Repository layout

```text
apps/
  api/                  composition / transport boundary
packages/
  core/                 game-agnostic domain primitives
  contracts/            typed commands and events
adapters/
  simulator/            deterministic development runtime
  cfx/                  public Cfx.re compatibility research
  gta6/                 reserved future GTA VI integration
infrastructure/
  database/             persistence and migrations
  docker/               local development infrastructure
docs/
  adr/                   architecture decisions
  architecture/          technical boundaries
  research/              confirmed facts vs unknowns
  roadmap/               phased preparation plan
  server/                RP server blueprint
  security/              threat model
.github/                 CI, ownership and repository hygiene
```

## Engineering principles

1. **Server authoritative.** The client requests actions; the server validates and commits state.
2. **Game-agnostic domain.** Core rules do not import GTA/FiveM natives or runtime globals.
3. **Ports and adapters.** Game integration is isolated behind explicit contracts.
4. **Transactional persistence.** Money, ownership and inventory changes are auditable.
5. **Security by default.** Trust boundaries and abuse cases are part of feature design.
6. **Modular monolith before microservices.** Complexity must be earned by real requirements.
7. **No invented GTA VI API.** Unknown runtime details stay unknown until verified.
8. **Single-server first.** Decisions optimize our future community, not a generic framework market.

## Technology direction

These are internal implementation choices, not assumptions about GTA VI's future scripting runtime:

- TypeScript for game-agnostic domain code, tooling, services and web-based UI prototypes;
- Lua/CfxLua only inside a Cfx adapter if public runtime requirements justify it;
- PostgreSQL as durable source of truth;
- Redis only for genuinely ephemeral coordination/cache needs;
- pnpm workspaces for the monorepo;
- Docker Compose for reproducible local infrastructure;
- GitHub Actions for automated validation.

## Development gate

Before implementing any GTA VI-specific adapter capability, require all of the following:

1. a public and legitimate source describing the capability;
2. an entry in the platform-status research document;
3. an ADR documenting the integration decision;
4. adapter conformance tests;
5. no leakage of game-specific APIs into the domain layer.

## Start here

- [Project scope](./docs/PROJECT_SCOPE.md)
- [Current GTA VI / RP platform status](./docs/research/PLATFORM_STATUS.md)
- [Server blueprint](./docs/server/SERVER_BLUEPRINT.md)
- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./docs/roadmap/ROADMAP.md)
- [Threat model](./docs/security/THREAT_MODEL.md)

## Local development

Requirements: Node.js 22+, pnpm 10+, and Docker when infrastructure services are needed.

```bash
pnpm install
cp .env.example .env
docker compose -f infrastructure/docker/compose.yml up -d
pnpm check
```

## Legal / project note

Independent private technical project. Not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re. Proprietary game assets, leaked materials and non-public APIs do not belong in this repository.
