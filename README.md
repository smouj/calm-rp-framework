<div align="center">

# GTA VI RP Platform

**An open-source community foundation for future Grand Theft Auto VI roleplay.**

[![CI](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-275D88.svg)](./LICENSE)
[![Project stage](https://img.shields.io/badge/stage-research_%26_prototype-D98B5F.svg)](./docs/roadmap/ROADMAP.md)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-326E74.svg)](./CONTRIBUTING.md)
[![GTA VI runtime](https://img.shields.io/badge/GTA_VI_runtime-unavailable-555555.svg)](./docs/server/RUNTIME_REQUIREMENTS.md)

**[English](./README.md) · [Español](./README.es.md) · [Contributing](./CONTRIBUTING.md) · [Roadmap](./docs/roadmap/ROADMAP.md)**

</div>

> [!IMPORTANT]
> **Not playable.** There is no GTA VI multiplayer client, custom server, installer or mod download here. This is an early, independent fan-made project developing roleplay systems and preparing for a **possible future authorized** GTA VI development/runtime path. It is not FiveM for GTA VI or an official Rockstar product.

## Our vision

Build an openly developed roleplay platform **inspired by the possibilities of FiveM**, with GTA VI as the long-term aspiration. Contributors can create reusable gameplay logic, test it without the game, improve tools and documentation, and explore integration **only when permission and technical support are verifiable**.

Developers, artists, testers, documentation writers, security specialists and fans are welcome. This project is not a fork of FiveM and does not currently implement a GTA VI modification or multiplayer network.

## Project status

| Area                                                        | Actual state                                              |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| TypeScript workspace, domain primitives and typed contracts | Initial code                                              |
| Game-independent simulator                                  | Basic player-directory prototype                          |
| API and local PostgreSQL infrastructure                     | Scaffolding and initial migration                         |
| Security, research and automated checks                     | Foundation                                                |
| Public Cfx/FiveM ecosystem research                         | Research only, not GTA VI compatibility                   |
| GTA VI game/runtime adapter                                 | **BLOCKED** — authorization and runtime contracts unknown |
| GTA VI client, multiplayer server or downloadable release   | **NOT IMPLEMENTED**                                       |

Rockstar announced the game's console launch on **19 November 2026**; that does **not** establish community-server support. See the [official release announcement](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available).

See the [roadmap](./docs/roadmap/ROADMAP.md), [platform status](./docs/research/PLATFORM_STATUS.md) and [runtime requirements](./docs/server/RUNTIME_REQUIREMENTS.md). We never mark a proposed feature as implemented.

## How it is designed

```text
                 COMMUNITY CONTRIBUTORS
                          |
             documentation + pull requests
                          |
               GAME-INDEPENDENT RP CORE
            characters / economy / inventory
           property / permissions / contracts
                       /       \
                      /         \
              SIMULATOR       RUNTIME ADAPTER
          test without GTA VI   (future, blocked)
                                     |
                            GTA VI authorization
                            & APIs NOT CONFIRMED
```

The core is server-authoritative: clients request actions; validated server commands decide the outcome. We keep unknown game APIs, client-native functions, asset formats and networking protocols out of domain logic. Existing FiveM/Cfx work and third-party GTA VI research are useful references, **not** evidence of a working GTA VI integration.

## Repository structure

- [`packages/core`](./packages/core/src/index.ts): game-independent primitives and rules.
- [`packages/contracts`](./packages/contracts/src/index.ts): typed commands and events.
- [`adapters/simulator`](./adapters/simulator/src/index.ts): deterministic tests without any game.
- [`adapters/cfx`](./adapters/cfx/README.md): current ecosystem research only.
- [`adapters/gta6`](./adapters/gta6/README.md): future integration boundary; currently reserved.
- [`apps/api`](./apps/api/src/index.ts): application/transport scaffold.
- [`infrastructure`](./infrastructure): local development services.
- [`docs`](./docs/README.md): architecture, research, security, roadmap and decisions.

## Run the development checks

You do **not** need GTA VI or any game files.

**Prerequisites:** Node.js 22+, pnpm 10.34.5 and, optionally, Docker for the local database.

```bash
git clone https://github.com/smouj/gta6-rp-platform.git
cd gta6-rp-platform
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
pnpm check
```

Optional development infrastructure:

```bash
docker compose -f infrastructure/docker/compose.yml up -d
```

`pnpm check` runs linting, TypeScript checks, unit tests and formatting validation. It does **not** run GTA VI or start a roleplay server.

## Get involved

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) ([español](./CONTRIBUTING.es.md)), [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and [GOVERNANCE.md](./GOVERNANCE.md).
- Browse [issues](https://github.com/smouj/gta6-rp-platform/issues), including [good first issues](https://github.com/smouj/gta6-rp-platform/labels/good%20first%20issue) and [help wanted](https://github.com/smouj/gta6-rp-platform/labels/help%20wanted).
- Propose one scoped change, create a fork and open a [pull request](https://github.com/smouj/gta6-rp-platform/pulls).
- Prefer reproducible tests, safe mock data and documentation with public sources. No secrets, leaks or proprietary game files.

Contributions are welcome; merging requires review and passing checks. Check the [FAQ](./docs/community/FAQ.md) and [SUPPORT.md](./SUPPORT.md) for help and [SECURITY.md](./SECURITY.md) for private vulnerability reports.

## Roadmap

1. **Public foundation:** license, contribution rules, security, project identity and reproducible CI.
2. **Portable RP systems:** server-authoritative characters, economy, inventory, jobs, property, moderation and simulator workflows.
3. **Developer experience:** conformance tests, example scenarios and reviewed extension contracts.
4. **GTA VI research:** continuously distinguish confirmed public facts from claims and assumptions.
5. **GTA VI integration:** **blocked** until legitimate authorization and implementable runtime documentation exist.

[Full roadmap](./docs/roadmap/ROADMAP.md) · [Architecture](./ARCHITECTURE.md) · [Scope](./docs/PROJECT_SCOPE.md) · [Research protocol](./docs/research/RESEARCH_PROTOCOL.md)

## Intellectual property and non-affiliation

**Unofficial fan project. Not affiliated with, endorsed by or sponsored by Rockstar Games, Take-Two Interactive or Cfx.re.** Grand Theft Auto, GTA, Grand Theft Auto VI, game logos, names, artwork, characters, audio and other protected game content belong to their respective rights holders, including Rockstar Games and Take-Two Interactive. All rights to that content are reserved by its owners.

The [MIT license](./LICENSE) covers **only the original source code and documentation** contributed to this repository. It does not license Rockstar's games, assets or trademarks. No game binaries, keys, extracted assets or leaked material are included. We do not claim authorization to host GTA VI multiplayer servers.

Read [TRADEMARKS.md](./TRADEMARKS.md), the [Rockstar RP policy](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers), [mod guidelines](https://www.rockstargames.com/es/community-resources/mod-guidelines) and [Creator Platform terms](https://fivem.net/terms/). Attribution and disclaimers **do not constitute permission** from the rights holders.
