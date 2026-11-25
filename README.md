<div align="center">

<img
  width="860"
  alt="Banner social oficial de CALM — Roleplay Framework: wordmark CALM blanco con estrella sobre la banda navy del banner, escena retro Miami en rosa y navy"
  src="./site/assets/banner-calm-social.png"
/>

# CALM — Roleplay Framework

**CALM Essentials** — an independent, modular, open-source **roleplay framework**.

CALM Essentials is the working product name: the base systems a roleplay server needs — characters, economy, inventory, jobs, organizations, properties, vehicles, permissions and extensions — designed in the product class of ESX Legacy and QBCore, developed and tested **without** the game, and prepared for a **possible future authorized** GTA VI integration. The repository is named `calm-rp-framework`: the project name carries no Rockstar trademark, and GTA appears only as a descriptive topic. This is **not** evidence of GTA VI compatibility or a Rockstar endorsement. Brand and trademark clearance remain pending.

[![CI](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-101020.svg)](./LICENSE)
[![Project stage](https://img.shields.io/badge/stage-research_%26_prototype-D05070.svg)](./docs/roadmap/ROADMAP.md)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-F06080.svg)](./CONTRIBUTING.md)
[![Discord community](https://img.shields.io/badge/Discord-community-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/BVWXWY5eUT)
[![GTA VI runtime](https://img.shields.io/badge/GTA_VI_runtime-unavailable-555555.svg)](./docs/server/RUNTIME_REQUIREMENTS.md)

**[English](./README.md) · [Español](./README.es.md) · [Contributing](./CONTRIBUTING.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Support](./SUPPORT.md) · [Roadmap](./docs/roadmap/ROADMAP.md) · [Goals](./GOALS.md) · [Discord community](https://discord.com/invite/BVWXWY5eUT)**

</div>

> [!IMPORTANT]
> **Not playable.** There is no GTA VI multiplayer client, custom server, installer or mod download here. This is an early, independent fan-made project developing roleplay systems and preparing for a **possible future authorized** GTA VI development/runtime path. It is not FiveM for GTA VI or an official Rockstar product.

## Our vision

Build **CALM Essentials**: an openly developed roleplay framework that supplies the systems an RP server needs. The goal is **not** a FiveM-style platform — there is no hosting, server browser, multiplayer network runtime or marketplace here. Contributors create reusable, server-authoritative roleplay systems, test them against the deterministic simulator, improve tooling and documentation, and prepare for integration **only when permission and technical support are verifiable**.

We take ESX's simplicity, QBCore's modular organization and Qbox's explicit exported services as **design references** — concepts only, since their cores are GPL-licensed and this project is MIT. No GTA VI APIs, native names, addresses or signatures are invented. Developers, artists, testers, documentation writers, security specialists and fans are welcome. This project is not a fork of FiveM, ESX, QBCore or Qbox, and does not currently implement a GTA VI modification or multiplayer network.

- [ADR-0007 — the CALM Essentials scope decision](./docs/adr/0007-calm-essentials-framework-scope.md)
- [Verified audit of the current code: present vs. missing](./docs/PROJECT_SCOPE.md)
- [Proposed service contracts and the ESX/QBCore/Qbox mapping](./docs/architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md)

## Public interfaces, legal boundaries and reverse-engineering research (24 November 2026)

The independent core now has original, fail-closed runtime capability contracts on the development PR. **Documented FiveM/Cfx/Qbox commands are not GTA VI commands.** RAGE 9 data-structure findings do not establish multiplayer or a supported scripting API.

- [Documented functions and original interface mapping](./docs/research/FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md)
- [GTA VI capability matrix — verified RAGE 9 research catalog](./docs/research/GTA6_CAPABILITY_MATRIX_2026-11-25.md)
- [GTA VI PC execution progress — VIctory, XCL, the Leonida DMCA, and why it is not an interface](./docs/research/GTA6_EXECUTION_PROGRESS_2026-11-25.md)
- [GTA VI RP mechanics observed by the press and our design consequences](./docs/research/GTA6_RP_MECHANICS_2026-11-25.md)
- [Spain/EU interoperability and intellectual-property review](./docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md)
- [Legal basis: the specific articles that make this project lawful](./docs/legal/LEGAL_BASIS_ARTICLES_2026-11-24.md)
- [Local verification: the authoritative gate, independent of hosted CI](./docs/operations/LOCAL_VERIFICATION.md)
- [Third-party RAGE 9 research status](./docs/research/GTA6_RESEARCH_2026-11-24.md)
- [Revision-pinned third-party tools](./docs/research/THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md)

Source links are research references; they are not game downloads or permission to run an unauthorized multiplayer service. This is a preliminary technical/legal assessment, not a legal opinion.

## Project status

The development branch also contains an **in-memory inventory reference** with ownership, capacity, transfer and idempotency tests. It is not persistent or connected to GTA VI. See [inventory reference](./docs/server/INVENTORY_REFERENCE.md) and [first-party evidence register](./docs/research/FIRST_PARTY_EVIDENCE_2026-11-24.md).

| Area                                                      | Actual state                                                                                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistent characters, sessions and economy (F1)          | PostgreSQL services and repositories, UUID identifiers, authenticated sessions, double-entry ledger; restart, recovery and concurrency suites |
| Characters, economy and inventory rules (in-memory)       | Reference implementations with tests                                                                                                          |
| Inventory persistence and general containers              | **Missing — Phase F2** (see the [audit](./docs/PROJECT_SCOPE.md))                                                                             |
| Game-independent simulator                                | Deterministic two-character prototype; fuller RP cycle pending                                                                                |
| Persistence infrastructure                                | `packages/persistence`: migration runner, `pg` pool, embedded-PostgreSQL verification engine                                                  |
| Security, research and automated checks                   | Foundation                                                                                                                                    |
| Public Cfx/FiveM ecosystem research                       | Research only, not GTA VI compatibility                                                                                                       |
| GTA VI game/runtime adapter                               | **BLOCKED** — authorization and runtime contracts unknown                                                                                     |
| GTA VI client, multiplayer server or downloadable release | **NOT IMPLEMENTED**                                                                                                                           |

Rockstar announced the game's console launch on **19 November 2026**; that does **not** establish community-server support. See the [official release announcement](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available).

**Hosted CI status:** `validate` runs on `main` and pull requests now complete with steps executed and pass (verified 2026-11-25 after the runner-assignment failures recorded in #33). Local verification (`bash scripts/verify-local.sh`) remains the authoritative gate; see the [CI workflow runs](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml) for the live status.

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

## Independent synthetic world planning

The simulator now includes an original, in-memory [world-planning catalog](./docs/server/WORLD_SPATIAL_READINESS.md): project-owned location IDs, distinct coordinate spaces, interior/exterior classifications, bounded 3D geometry, parent hierarchies and deterministic proximity queries. **No GTA VI map/asset data, navigation API, world hook, multiplayer interface or proprietary coordinates are involved.** The [proposed ADR-0005](./docs/adr/0005-independent-world-planning.md) documents its limitations.

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
git clone https://github.com/smouj/calm-rp-framework.git
cd calm-rp-framework
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

## Website and independent framework name

The original static information website lives in [`site/`](./site/README.md), including a [self-contained legal notice](./site/legal.html). GitHub Pages deployment requires the repository owner's Pages settings and a successful build; do not advertise a live URL until verified. **CALM** is the framework's chosen working name (a deliberate contrast in tone with RAGE) and **CALM Essentials** is the product-level working name; neither is a cleared or exclusive trademark. FINOS already uses CALM for a software architecture specification, and Calm.com uses CALM for software products. See the [brand decision and conflict notes](./docs/branding/FRAMEWORK_NAMING_OPTIONS.md). No API or package namespace was renamed.

## Get involved

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) ([español](./CONTRIBUTING.es.md)), [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and [GOVERNANCE.md](./GOVERNANCE.md).
- Browse [issues](https://github.com/smouj/calm-rp-framework/issues), including [good first issues](https://github.com/smouj/calm-rp-framework/labels/good%20first%20issue) and [help wanted](https://github.com/smouj/calm-rp-framework/labels/help%20wanted).
- Propose one scoped change, create a fork and open a [pull request](https://github.com/smouj/calm-rp-framework/pulls).
- Prefer reproducible tests, safe mock data and documentation with public sources. No secrets, leaks or proprietary game files.

Contributions are welcome; merging requires review and passing checks. Check the [FAQ](./docs/community/FAQ.md) and [SUPPORT.md](./SUPPORT.md) for help and [SECURITY.md](./SECURITY.md) for private vulnerability reports.

## Roadmap

0. **Project reformulation** — ✅ completed 2026-11-25: CALM Essentials scope, documentation and site now describe the framework.
1. **Persistence and characters** — PostgreSQL-backed accounts, characters and sessions that survive restarts; balanced-ledger invariant; unified identifiers.
2. **Economy and inventory** — durable, idempotent transactions; containers (vehicle, warehouse, property) with location-independent ownership.
3. **Jobs and organizations** — grades, duty, salaries and a full payroll cycle linked to financial accounts.
4. **Independent resources** — versioned module contracts, manifests and permissions; two modules communicating through public services before formalizing extensions.
5. **Game adaptation** — **blocked** until a public, authorized GTA VI integration path exists.

First tangible goal: two simulated characters hold jobs, get paid, buy, store and trade items, and keep every byte of their data after a restart.

[Full roadmap](./docs/roadmap/ROADMAP.md) · [Architecture](./ARCHITECTURE.md) · [Scope](./docs/PROJECT_SCOPE.md) · [Research protocol](./docs/research/RESEARCH_PROTOCOL.md)

## Intellectual property and non-affiliation

**Unofficial fan project. Not affiliated with, endorsed by or sponsored by Rockstar Games, Take-Two Interactive or Cfx.re.** Grand Theft Auto, GTA, Grand Theft Auto VI, game logos, names, artwork, characters, audio and other protected game content belong to their respective rights holders, including Rockstar Games and Take-Two Interactive. All rights to that content are reserved by its owners.

The [MIT license](./LICENSE) covers **only the original source code and documentation** contributed to this repository. It does not license Rockstar's games, assets or trademarks. No game binaries, keys, extracted assets or leaked material are included. We do not claim authorization to host GTA VI multiplayer servers.

Read [TRADEMARKS.md](./TRADEMARKS.md), the [Rockstar RP policy](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers), [mod guidelines](https://www.rockstargames.com/es/community-resources/mod-guidelines) and [Creator Platform terms](https://fivem.net/terms/). Attribution and disclaimers **do not constitute permission** from the rights holders.
