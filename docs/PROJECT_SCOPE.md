# Project Scope — CALM Essentials

**State:** Active community-led project scope
**Working product name:** **CALM Essentials** — the GTA VI-first roleplay product developed in this repository
**Updated:** 2026-11-27 · Current scope recorded in [ADR-0009](./adr/0009-gta-vi-first-product-scope.md)

## Product definition

CALM Essentials is an independent, fan-led, open-source **GTA VI-first roleplay project**. Its CALM-owned domains and contracts model the intended RP experience around GTA VI behavior, including characters, economy, carried items, storage, jobs, organizations, vehicles, properties and permissions. The simulator and synthetic data let CALM build and test these target-specific rules before an authorized game runtime exists. ESX Legacy, QBCore, Qbox and FiveM are not CALM's product model, architecture template or compatibility targets.

Today it is **not a playable mod, GTA VI client, custom game server, or GTA VI-compatible multiplayer framework**. The released game is a single-player product on PS5 and Xbox Series X|S; this repository has no authorized GTA VI network, scripting or resource runtime. Hosting, server browsing, a generic game platform and a third-party plugin marketplace are out of scope. Publishing source code neither creates permission to use proprietary game material nor proves an integration path exists.

The repository is named `calm-rp-framework`; the product working name CALM Essentials carries no Rockstar trademark, and brand and trademark clearance remain pending.

## Two registers, kept separate

| Register                   | Content                                                                                                                | Availability                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **CALM GTA VI RP domains** | Characters, sessions, economy, carried/stored inventory, jobs, organizations, properties, vehicles, permissions, audit | Target-specific rules can be modeled and tested in the simulator **now** |
| **Game functions**         | Client/server entity control, scripting, events, synchronization, asset streaming for GTA VI                           | Only with verified, authorized interfaces                                |

No GTA VI names, memory addresses, identifiers or function signatures are invented. Knowing how a game mechanic behaves is not knowing the engine interface that runs it.

## Intended contributors and users

- Community developers building CALM's server-authoritative GTA VI RP systems and simulator.
- Testers and designers improving deterministic simulation and developer tooling.
- Writers and researchers documenting architecture, verified sources and risks.
- Future CALM maintainers integrating through documented, authorized GTA VI interfaces.

## In scope now

- GTA VI-targeted RP domain systems: accounts, characters, sessions, economy, ledger, carried/stored inventory, jobs, organizations, property, vehicles, police records, permissions and audit — with code, contracts, tests and documentation.
- A deterministic simulator, synthetic fixtures, automated tests and reproducible infrastructure for validating CALM behavior; they are not game emulation or generic-platform commitments.
- CALM-owned service contracts for its GTA VI RP workflows. The project does not copy ESX/QBCore/Qbox code or adopt their APIs as design requirements.
- PostgreSQL-first durable state; transactional integrity, idempotency and recovery.
- Community contribution guidelines, governance, bilingual onboarding and original branding.
- Research into Rockstar/Cfx first-party announcements and clearly scoped third-party observations, with evidence grading.

## Conditional, not implemented

Game-facing scripts, GTA VI client/server synchronization, entity APIs, voice, asset streaming, world integration, hosting, multiplayer downloads, resource marketplaces and server discovery are **not available**. Implementing them requires legitimate authorization, compatible published interfaces, risk review, architecture decisions and conformance tests. The GTA VI adapter stays **BLOCKED**.

## Verified audit of the current code (2026-11-27, updated during F2)

| Component   | Already present                                                                                                                                                                                                    | Still missing                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Identifiers | One canonical UUID form validated at every persistent boundary                                                                                                                                                     | — (resolved in F1)                                                                      |
| Sessions    | Server-issued tokens, hash-only storage, expiry/revocation, impersonation-proof resolution over PostgreSQL                                                                                                         | API wiring of the session middleware (F2+)                                              |
| Characters  | Persistent creation, recovery and ownership control over PostgreSQL; validated registration                                                                                                                        | Full character lifecycle beyond creation/retirement; multi-character policies           |
| Economy     | Double-entry ledger over PostgreSQL: atomic, balanced, idempotent posting, reserved treasury, concurrency-safe                                                                                                     | Inventory-linked economy, salaries and payroll (F3)                                     |
| Inventory   | In-memory reference plus additive F2 schema, authenticated transaction service/repository, carried/storage simulator flow, idempotency, immutable receipts, capacity guards and embedded restart/rollback coverage | Live PostgreSQL 17 multi-connection CI gate; F2 acceptance remains open until it passes |
| Database    | Five additive migrations, runner, embedded-PostgreSQL verification engine                                                                                                                                          | Jobs tables and service persistence (F3)                                                |
| Simulator   | Deterministic two-character economy and persistent inventory scenario with vehicle storage, retrieval and trade using synthetic data                                                                               | Jobs and a fuller RP cycle on the persistent stack                                      |
| API         | Basic status endpoint                                                                                                                                                                                              | Services, HTTP authentication and public operations                                     |
| Adapters    | Capability and session contracts                                                                                                                                                                                   | Full implementations and capability tests                                               |
| GTA VI      | Reserved adapter boundary                                                                                                                                                                                          | Every integration interface (blocked)                                                   |

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

**Next (Phases F1–F2):** the F1 persistence foundation (characters, sessions and double-entry ledger) is delivered and covered by restart and concurrency suites; broader API/transport, privileged-grant audit, rate limiting and threat-model closeout remain open in [issue #32](https://github.com/smouj/calm-rp-framework/issues/32). F2's CALM GTA VI RP service, repository and synthetic simulator flow are implemented on the current candidate; final acceptance depends on all issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) criteria and the exact-head live PostgreSQL 17 CI suite.

**Conditional future (Phase F5):** evaluate public, legitimate GTA VI integration capabilities using the runtime requirement register, ADRs and conformance tests.
