# Documentation Map

This directory is the maintained knowledge base for **CALM Essentials**, the open-source roleplay framework developed in this repository.

The repository is intentionally split between **decisions we control now** and **runtime facts that must be verified later**. Documentation should make that boundary obvious at all times. The scope decision is [ADR-0007](./adr/0007-calm-essentials-framework-scope.md).

## Start here

| Document                                                                   | Purpose                                                       | Authority                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------- |
| [`PROJECT_SCOPE.md`](./PROJECT_SCOPE.md)                                   | Product boundary, goals, non-goals and decision gates         | Project scope source of truth   |
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md)                                 | System-level architecture and dependency direction            | Architecture overview           |
| [`server/SERVER_BLUEPRINT.md`](./server/SERVER_BLUEPRINT.md)               | Reference RP server feature blueprint                         | Server-design reference         |
| [`server/RUNTIME_REQUIREMENTS.md`](./server/RUNTIME_REQUIREMENTS.md)       | Runtime capabilities required before real GTA VI integration  | Integration readiness register  |
| [`research/PLATFORM_STATUS.md`](./research/PLATFORM_STATUS.md)             | Confirmed public facts versus unknown GTA VI platform details | Platform-status source of truth |
| [`research/RESEARCH_PROTOCOL.md`](./research/RESEARCH_PROTOCOL.md)         | Evidence classification and research update process           | Research governance             |
| [`roadmap/ROADMAP.md`](./roadmap/ROADMAP.md)                               | Phased work and integration gates                             | Delivery planning               |
| [`security/THREAT_MODEL.md`](./security/THREAT_MODEL.md)                   | Assets, trust boundaries, threats and controls                | Security baseline               |
| [`operations/OPERATIONS_BASELINE.md`](./operations/OPERATIONS_BASELINE.md) | Operational requirements before production hosting            | Operations baseline             |

## Verified functions and legal research (24 November 2026)

- [`legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md`](./legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md) — EU/Spanish interoperability limits, Rockstar/Cfx permissions, code and asset provenance controls (preliminary, not legal advice).
- [`research/FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md`](./research/FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md) — real documented FiveM/Qbox symbols versus unavailable GTA VI equivalents, plus evidence-neutral runtime port contracts.
- [`research/GTA6_RESEARCH_2026-11-24.md`](./research/GTA6_RESEARCH_2026-11-24.md) — third-party reverse-engineering claims, limitations, and safe project implications.
- [`operations/THIRD_PARTY_ARTIFACT_POLICY.md`](./operations/THIRD_PARTY_ARTIFACT_POLICY.md) — third-party artifacts, protected file formats and research provenance safeguards.
- [`operations/RELEASE_READINESS_2026-11-24.md`](./operations/RELEASE_READINESS_2026-11-24.md) — historical release-readiness snapshot, superseded by the current review.
- [`operations/RELEASE_READINESS_2026-11-27.md`](./operations/RELEASE_READINESS_2026-11-27.md) — current CALM scope, local/hosted verification status, and remaining publication gates.
- [`server/PORTABLE_ROLEPLAY_REFERENCE.md`](./server/PORTABLE_ROLEPLAY_REFERENCE.md) — limits and security gates of the in-memory character/economy example.

## Research pass (25 November 2026)

- [`research/GTA6_CAPABILITY_MATRIX_2026-11-25.md`](./research/GTA6_CAPABILITY_MATRIX_2026-11-25.md) — canonical engine-knowledge catalog: verified format/engine findings, confidence levels, CALM utility and architecture consequence per row.
- [`research/UNCERTAINTY_REGISTER_2026-11-25.md`](./research/UNCERTAINTY_REGISTER_2026-11-25.md) — what is not legitimately known, why it matters, and the trigger that would resolve each item.
- [`research/ARCHITECTURE_COMPARISON_2026-11-25.md`](./research/ARCHITECTURE_COMPARISON_2026-11-25.md) — pattern-by-pattern verdict of CALM versus FiveM/RedM, QBCore/Mantle, Qbox and ESX, plus the Phase-5 audit conclusion.
- [`roadmap/ROADMAP_REVISION_2026-11-25.md`](./roadmap/ROADMAP_REVISION_2026-11-25.md) — evidence-based reorganization proposal and concrete edits proposed for `ROADMAP.md` (requires human review).

## CALM Essentials scope and research follow-up (25–27 November 2026)

- [`adr/0007-calm-essentials-framework-scope.md`](./adr/0007-calm-essentials-framework-scope.md) — accepted scope decision: CALM's original roleplay framework domains and contracts; external frameworks are references only.
- [`research/VICTORY_SOURCE_AUDIT_2026-11-26.md`](./research/VICTORY_SOURCE_AUDIT_2026-11-26.md) — pinned static review of VIctory and the November Xbox-build/EXE claims, GitHub takedown, malware lures, and what none of them establishes for GTA VI RP.
- [`research/GTA6_EXECUTION_PROGRESS_2026-11-25.md`](./research/GTA6_EXECUTION_PROGRESS_2026-11-25.md) — verified PC-execution findings (VIctory, XCL, the fxceless fork, the Leonida DMCA) and why none of them is a resource-execution interface.
- [`research/GTA6_RP_MECHANICS_2026-11-25.md`](./research/GTA6_RP_MECHANICS_2026-11-25.md) — observed mechanics, official status/health/activity evidence, unknown character-stat schema, and the CALM progression boundary.
- [`research/GTA6_INTERNAL_SYSTEMS_2026-11-27.md`](./research/GTA6_INTERNAL_SYSTEMS_2026-11-27.md) — developer-reported campaign systems, composition/reuse clues, and what they do and do not reveal about Rockstar's code.
- [`server/CHARACTER_PROGRESSION.md`](./server/CHARACTER_PROGRESSION.md) — configurable CALM progression model, server-authoritative change rules, and evidence gaps for GTA VI stats.
- [`research/GTA6_RP_STRATEGY_2026-11-25.md`](./research/GTA6_RP_STRATEGY_2026-11-25.md) — strategy synthesis: three-environment boundary, integration scenarios, three-layer model with a per-capability adapter registry, Leonida region mapping and the build-now versus needs-GTA-VI split.
- [`architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md`](./architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md) — original proposed CALM service contracts, with an external-framework comparison for context only.
- [`roadmap/ROADMAP.md`](./roadmap/ROADMAP.md) — phases F0–F5 with acceptance criteria; F0 completed 2026-11-25.

## Contributor examples

- [`community/SIMULATOR_GUIDE.es.md`](./community/SIMULATOR_GUIDE.es.md) — Spanish guide to the game-independent simulator, repository boundaries and local checks.
- [`community/SIMULATOR_DOMAIN_EXAMPLES.md`](./community/SIMULATOR_DOMAIN_EXAMPLES.md) — compile-ready synthetic command/event example with server-side ownership validation; no GTA VI runtime behavior is implied.

- [`server/INVENTORY_REFERENCE.md`](./server/INVENTORY_REFERENCE.md) — tested in-memory item, inventory and ownership semantics; not a production persistence layer.
- [`research/FIRST_PARTY_EVIDENCE_2026-11-24.md`](./research/FIRST_PARTY_EVIDENCE_2026-11-24.md) — first-party sources, scope limits and unconfirmed GTA VI runtime capabilities.

- [`research/THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md`](./research/THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md) — commit-pinned external tools, exact upstream claims and integration limits.

- [`branding/FRAMEWORK_NAMING_OPTIONS.md`](./branding/FRAMEWORK_NAMING_OPTIONS.md) — selected CALM framework working name, trademark collisions and migration gates.

- [`server/WORLD_SPATIAL_READINESS.md`](./server/WORLD_SPATIAL_READINESS.md) — independent synthetic world/location catalog and its runtime limits.
- [`adr/0005-independent-world-planning.md`](./adr/0005-independent-world-planning.md) — proposed independent spatial-planning decision (not a game API).

- [`roadmap/ASSUMPTIONS_AND_DEPENDENCIES.md`](./roadmap/ASSUMPTIONS_AND_DEPENDENCIES.md) — official fact/hypothesis boundary, external proof gates, reversible decisions.

- [`operations/GITHUB_PAGES_DEPLOYMENT.md`](./operations/GITHUB_PAGES_DEPLOYMENT.md) — website setup, verification and limits.
- [`operations/BRANCH_RETIREMENT.md`](./operations/BRANCH_RETIREMENT.md) — stale refs, unmerged alternative, backup before branch removal.

## Supporting references

- [`research/AUTONOMOUS_RESEARCH.md`](./research/AUTONOMOUS_RESEARCH.md) — autonomous source-monitoring cadence, PR behavior, merge boundary and notification policy.
- [`research/ROCKSTAR_TECHNOLOGY_BASELINE.md`](./research/ROCKSTAR_TECHNOLOGY_BASELINE.md) — first-party Rockstar/Cfx technology evidence, planning implications and explicit limits on GTA VI inference.
- [`server/DOMAIN_CATALOG.md`](./server/DOMAIN_CATALOG.md) — domain ownership, invariants and runtime dependencies.
- [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) — material project risks, mitigations and reassessment triggers.
- [`branding/PROJECT_IDENTITY.md`](./branding/PROJECT_IDENTITY.md) — independent identity, asset and documentation-style policy.

## Architecture decisions

Architecture Decision Records live in [`adr/`](./adr/).

- [`0008-persistent-inventory-containers.md`](./adr/0008-persistent-inventory-containers.md) — F2 ownership/location model, immutable receipts, container capacity and the authenticated service boundary.

- [`0001-game-agnostic-core.md`](./adr/0001-game-agnostic-core.md) — domain code remains independent from game runtimes.
- [`0002-single-server-not-framework.md`](./adr/0002-single-server-not-framework.md) — historical single-server scope, superseded by ADR-0006.
- [`0003-modular-monolith-first.md`](./adr/0003-modular-monolith-first.md) — keep deployment simple until measured requirements justify extraction.
- [`0004-authoritative-postgresql-ephemeral-redis.md`](./adr/0004-authoritative-postgresql-ephemeral-redis.md) — durable RP state has one authoritative store; Redis remains reconstructable.

- [`0006-community-open-platform.md`](./adr/0006-community-open-platform.md) — accepted open-source, community-contributed RP platform scope.
- [`0007-calm-essentials-framework-scope.md`](./adr/0007-calm-essentials-framework-scope.md) — accepted CALM Essentials framework scope; refines ADR-0006's ambition.

New ADRs are required when a change introduces a durable architectural constraint, changes a cross-module contract, adopts a new authoritative data store, or binds the project to a verified GTA VI runtime capability.

## Open-source community

- [`../README.md`](../README.md) and [`../README.es.md`](../README.es.md) — international and Spanish onboarding.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) and [`../CONTRIBUTING.es.md`](../CONTRIBUTING.es.md) — contributor workflow and Spanish onboarding.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — expectations for respectful collaboration.
- [`../GOVERNANCE.md`](../GOVERNANCE.md) — review, decision and maintainer responsibilities.
- [`../SUPPORT.md`](../SUPPORT.md) — support channels and their limitations.
- [`community/FAQ.md`](./community/FAQ.md) — community FAQ, including the no-multiplayer status.
- [`../TRADEMARKS.md`](../TRADEMARKS.md) — fan-project identity and third-party rights.
- [`community/PUBLIC_LAUNCH_CHECKLIST.md`](./community/PUBLIC_LAUNCH_CHECKLIST.md) — safety gates and GitHub publication settings.

## Research document responsibilities

The research documents serve different responsibilities and should not be collapsed into one:

1. `PLATFORM_STATUS.md` answers **what is currently confirmed or unknown for GTA VI/community servers**.
2. `ROCKSTAR_TECHNOLOGY_BASELINE.md` answers **what current first-party Rockstar/Cfx engineering evidence tells us about technology choices, and what it does not prove about GTA VI**.
3. `RESEARCH_PROTOCOL.md` defines **how evidence is admitted, classified, promoted, contradicted and reviewed**.
4. `AUTONOMOUS_RESEARCH.md` defines **how the periodic watcher applies those rules, opens PRs and decides what may or may not be integrated automatically**.

This split prevents a true statement such as “Rockstar gameplay engineers use C++” from being silently transformed into the unsupported statement “GTA VI community servers will use C++”.

## Documentation ownership rules

1. **Scope before implementation.** If a proposed capability changes what the project is, update `PROJECT_SCOPE.md` first.
2. **Evidence before GTA VI integration.** A GTA VI-specific implementation cannot precede a verified entry in `research/PLATFORM_STATUS.md`.
3. **ADR before durable coupling.** Long-lived architecture decisions must be recorded before they become implicit code contracts.
4. **Blueprint before feature sprawl.** Server features should map to an explicit server need, not exist only because other RP frameworks expose them.
5. **Operations before production.** Backups, restore, auditing, observability and incident handling are release requirements, not post-launch extras.
6. **Unknown means unknown.** Current FiveM/RedM behavior may inform research but cannot be silently promoted to a GTA VI guarantee.
7. **Technology evidence is scoped.** A language or tool confirmed in Rockstar's current engineering stack does not become a GTA VI community-server runtime contract without GTA VI-specific evidence.
8. **Automation follows governance.** Scheduled research may maintain documentation, but it cannot bypass evidence, CI, ADR or runtime-promotion gates.

## Document states

Use these states when a document benefits from an explicit maturity marker:

- `DRAFT` — incomplete and not yet relied on as a project contract.
- `ACTIVE` — current project guidance.
- `BLOCKED` — waiting on an external dependency or verified runtime information.
- `SUPERSEDED` — retained for history but replaced by a named document or ADR.

Do not use speculative labels such as “almost confirmed”. Platform evidence uses the separate classification defined in `research/RESEARCH_PROTOCOL.md`.

## Style

Documentation should be concise, technical and attributable to the project itself.

Avoid generated-looking signatures, assistant/model attribution, decorative footers, fabricated certainty, promotional claims and copied framework boilerplate. Every document should exist because it helps design, verify, operate or integrate our future server.
