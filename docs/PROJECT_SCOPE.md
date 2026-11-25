# Project Scope — CALM Essentials

**State:** Active community-led project scope
**Working product name:** **CALM Essentials** — the roleplay framework developed in this repository
**Updated:** 2026-11-25 · Scope decision recorded in [ADR-0007](./adr/0007-calm-essentials-framework-scope.md)

## Product definition

CALM Essentials is an independent, fan-led, open-source **roleplay framework** in the product class of ESX Legacy and QBCore: the base systems a roleplay server needs — characters, economy, inventory, jobs, organizations, properties, vehicles, permissions and extensions — developed and tested **without** the game, and prepared for a **possible future authorized** GTA VI integration.

Today it is **not a playable mod, GTA VI client, custom game server, or supported multiplayer framework**. It is also **not** a FiveM-style platform: hosting, server browsing, a multiplayer network runtime and a plugin marketplace are out of scope. Publishing source code neither creates permission to use proprietary game material nor proves an integration path exists.

The repository is named `calm-rp-framework`; the product working name CALM Essentials carries no Rockstar trademark, and brand and trademark clearance remain pending.

## Two registers, kept separate

| Register           | Content                                                                                                 | Availability                              |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **RP functions**   | Characters, sessions, economy, inventory, jobs, organizations, properties, vehicles, permissions, audit | Implementable and testable **now**        |
| **Game functions** | Client/server entity control, scripting, events, synchronization, asset streaming for GTA VI            | Only with verified, authorized interfaces |

No GTA VI names, memory addresses, identifiers or function signatures are invented. Knowing how a game mechanic behaves is not knowing the engine interface that runs it.

## Intended contributors and users

- Community developers building portable, server-authoritative RP logic and modules.
- Testers and designers improving deterministic simulation and developer tooling.
- Writers and researchers documenting architecture, verified sources and risks.
- Future server authors who may reuse tested systems, without a GTA VI compatibility promise.

## In scope now

- RP domain systems: accounts, characters, sessions, economy, ledger, inventory, jobs, organizations, property, vehicles, police records, permissions and audit — as progressive modules with code, contracts, tests and documentation.
- Game-independent simulators, synthetic fixtures, automated tests and reproducible infrastructure.
- Public service contracts (proposal stage): session, character, economy, inventory, jobs, permissions and hooks interfaces mapped against documented ESX/QBCore/Qbox equivalents.
- PostgreSQL-first durable state; transactional integrity, idempotency and recovery.
- Community contribution guidelines, governance, bilingual onboarding and original branding.
- Research into Rockstar/Cfx first-party announcements and clearly scoped third-party observations, with evidence grading.

## Conditional, not implemented

Game-facing scripts, GTA VI client/server synchronization, entity APIs, voice, asset streaming, world integration, hosting, multiplayer downloads, resource marketplaces and server discovery are **not available**. Implementing them requires legitimate authorization, compatible published interfaces, risk review, architecture decisions and conformance tests. The GTA VI adapter stays **BLOCKED**.

## Verified audit of the current code (2026-11-25, updated after Phase F1)

| Component   | Already present                                                                                                | Still missing                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Identifiers | One canonical UUID form validated at every persistent boundary                                                 | — (resolved in F1)                                                            |
| Sessions    | Server-issued tokens, hash-only storage, expiry/revocation, impersonation-proof resolution over PostgreSQL     | API wiring of the session middleware (F2+)                                    |
| Characters  | Persistent creation, recovery and ownership control over PostgreSQL; validated registration                    | Full character lifecycle beyond creation/retirement; multi-character policies |
| Economy     | Double-entry ledger over PostgreSQL: atomic, balanced, idempotent posting, reserved treasury, concurrency-safe | Inventory-linked economy, salaries and payroll (F3)                           |
| Inventory   | Definitions, capacity, quantities, transfers, consumption                                                      | Persistence, general containers, metadata, concurrency                        |
| Database    | Two additive migrations, runner, embedded-PostgreSQL verification engine                                       | Inventory tables (F2), jobs tables (F3)                                       |
| Simulator   | Deterministic two-character scenario with transfers                                                            | Jobs and a fuller RP cycle on the persistent stack                            |
| API         | Basic status endpoint                                                                                          | Services, HTTP authentication and public operations                           |
| Adapters    | Capability and session contracts                                                                               | Full implementations and capability tests                                     |
| GTA VI      | Reserved adapter boundary                                                                                      | Every integration interface (blocked)                                         |

The two technical debts recorded before F1 are **resolved**: the ledger service now guarantees balanced transactions (domain validation, an in-transaction balance re-derivation, and a deferred constraint trigger that rejects unbalanced rows written even by direct SQL), and the string-versus-UUID identifier mismatch is unified on the canonical UUID form across domain types and database columns.

## Explicit exclusions

- Impersonating or implying endorsement by Rockstar Games, Take-Two, ESX, QBCore, Qbox, FiveM or Cfx.re.
- Copying GPL framework code (ESX Legacy, `qbx_core`) into this MIT repository; concepts are studied, implementations are original.
- Redistributing proprietary GTA VI assets, archives, executables, keys, protected resources or leaks.
- Accessing private Rockstar services or treating non-public interfaces as dependencies.
- Claiming GTA VI server support based on technical file research.
- Promising an executable, release date, plugin ABI or supported platform that is not verified.
- Building a commercial hosting or marketplace offering before need, licensing and policy are reviewed.

## Design guardrails

1. Build independently testable functionality; do not wait for a speculative game API.
2. Keep client input untrusted and persisted RP state server-authoritative.
3. Prefer a modular monolith before microservices and unnecessary platform complexity.
4. Separate confirmed facts, observed third-party behavior, hypotheses and blocked requirements.
5. Maintain transparent code review, licensing, security and reproducibility for contributors.
6. Keep visual identity original, with conspicuous non-affiliation and rights attribution.
7. Require a specific, authorized GTA VI runtime contract before game-facing implementation.

## Readiness goals

**Immediate (Phase F0 — completed with this change):** CALM Essentials framing across scope, architecture, roadmap, READMEs and site.

**Next (Phases F1–F2):** persistent characters and sessions; durable economy and inventory transactions — **F1 is delivered** (characters, sessions and the double-entry ledger over PostgreSQL, verified with restart and concurrency suites); F2 adds inventory and container durability.

**Conditional future (Phase F5):** evaluate public, legitimate GTA VI integration capabilities using the runtime requirement register, ADRs and conformance tests.
