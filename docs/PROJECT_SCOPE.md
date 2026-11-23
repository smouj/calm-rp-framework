# Project Scope — Open Community RP Platform

**State:** Active community-led project scope

**Updated:** 2026-11-23

## Product definition

GTA VI RP Platform is an independent, fan-led **open-source** project aiming to develop a reusable roleplay platform inspired by the possibilities of FiveM, with GTA VI as a **conditional long-term target**.

Today it is **not a playable mod, GTA VI client, custom game server, or supported multiplayer framework**. Publishing source code neither creates permission to use proprietary game material nor proves an integration path exists.

This replaces the previous _single private server only_ goal recorded in [ADR-0002](./adr/0002-single-server-not-framework.md). The accepted scope change is recorded in [ADR-0006](./adr/0006-community-open-platform.md); the modular-monolith architecture decision remains in effect.

## Intended contributors and users

- Community developers building portable, server-authoritative RP logic.
- Testers and designers improving deterministic simulation and developer tooling.
- Writers and researchers documenting architecture, verified source material and risks.
- Future communities that may reuse tested modules, without a current GTA VI compatibility promise.

## In scope now

- Core RP concepts: accounts, sessions, characters, economy, ledger, inventory, jobs, factions, property, vehicles, emergency services, administration, moderation, permissions and audit.
- Game-independent simulators, synthetic fixtures, automated tests and reproducible development infrastructure.
- Clear internal contracts and **reviewed** extensibility only when a concrete use case justifies it.
- PostgreSQL-first durable state; secure operations, observability, migrations and recovery.
- Public contribution guidelines, governance, translated onboarding, community issue management and original branding.
- Research into Rockstar/Cfx first-party announcements and clearly scoped third-party technology observations.

## Conditional, not implemented

Game-facing scripts, GTA VI client/server synchronization, game entity APIs, voice, asset streaming, world integration, hosting, multiplayer downloads, resource marketplaces and server discovery are **not available**. Implementing them requires legitimate authorization, compatible published interfaces, risk review, architecture decisions and conformance tests.

A FiveM-like ecosystem is the **aspiration**, not the current feature set or a scheduled release.

## Explicit exclusions

- Impersonating or implying endorsement by Rockstar Games, Take-Two, FiveM or Cfx.re.
- Redistributing proprietary GTA VI assets, archives, executables, keys, protected resources or leaks.
- Accessing private Rockstar services or treating non-public interfaces as dependencies.
- Claiming GTA VI server support based solely on technical file research.
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

**Immediate:** publicly understandable source, safe contributor onboarding and passing tests.

**Next:** reusable RP domain modules and simulator workflows with documented contracts.

**Conditional future:** evaluate public, legitimate GTA VI integration capabilities using the runtime requirement register, ADRs and conformance tests. The GTA VI adapter remains **BLOCKED** until then.
