# Documentation Map

This directory is the maintained knowledge base for the future GTA VI RP server project.

The repository is intentionally split between **decisions we control now** and **runtime facts that must be verified later**. Documentation should make that boundary obvious at all times.

## Start here

| Document                                                                   | Purpose                                                       | Authority                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------- |
| [`PROJECT_SCOPE.md`](./PROJECT_SCOPE.md)                                   | Product boundary, goals, non-goals and decision gates         | Project scope source of truth   |
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md)                                 | System-level architecture and dependency direction            | Architecture overview           |
| [`server/SERVER_BLUEPRINT.md`](./server/SERVER_BLUEPRINT.md)               | Functional blueprint for our future RP server                 | Server-design reference         |
| [`server/RUNTIME_REQUIREMENTS.md`](./server/RUNTIME_REQUIREMENTS.md)       | Runtime capabilities required before real GTA VI integration  | Integration readiness register  |
| [`research/PLATFORM_STATUS.md`](./research/PLATFORM_STATUS.md)             | Confirmed public facts versus unknown GTA VI platform details | Platform-status source of truth |
| [`research/RESEARCH_PROTOCOL.md`](./research/RESEARCH_PROTOCOL.md)         | Evidence classification and research update process           | Research governance             |
| [`roadmap/ROADMAP.md`](./roadmap/ROADMAP.md)                               | Phased work and integration gates                             | Delivery planning               |
| [`security/THREAT_MODEL.md`](./security/THREAT_MODEL.md)                   | Assets, trust boundaries, threats and controls                | Security baseline               |
| [`operations/OPERATIONS_BASELINE.md`](./operations/OPERATIONS_BASELINE.md) | Operational requirements before production hosting            | Operations baseline             |

## Supporting references

- [`server/DOMAIN_CATALOG.md`](./server/DOMAIN_CATALOG.md) — domain ownership, invariants and runtime dependencies.
- [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) — material project risks, mitigations and reassessment triggers.
- [`branding/PROJECT_IDENTITY.md`](./branding/PROJECT_IDENTITY.md) — independent identity, asset and documentation-style policy.

## Architecture decisions

Architecture Decision Records live in [`adr/`](./adr/).

- [`0001-game-agnostic-core.md`](./adr/0001-game-agnostic-core.md) — domain code remains independent from game runtimes.
- [`0002-single-server-not-framework.md`](./adr/0002-single-server-not-framework.md) — optimize for our server, not a generic framework product.
- [`0003-modular-monolith-first.md`](./adr/0003-modular-monolith-first.md) — keep deployment simple until measured requirements justify extraction.
- [`0004-authoritative-postgresql-ephemeral-redis.md`](./adr/0004-authoritative-postgresql-ephemeral-redis.md) — durable RP state has one authoritative store; Redis remains reconstructable.

New ADRs are required when a change introduces a durable architectural constraint, changes a cross-module contract, adopts a new authoritative data store, or binds the project to a verified GTA VI runtime capability.

## Documentation ownership rules

1. **Scope before implementation.** If a proposed capability changes what the project is, update `PROJECT_SCOPE.md` first.
2. **Evidence before GTA VI integration.** A GTA VI-specific implementation cannot precede a verified entry in `research/PLATFORM_STATUS.md`.
3. **ADR before durable coupling.** Long-lived architecture decisions must be recorded before they become implicit code contracts.
4. **Blueprint before feature sprawl.** Server features should map to an explicit server need, not exist only because other RP frameworks expose them.
5. **Operations before production.** Backups, restore, auditing, observability and incident handling are release requirements, not post-launch extras.
6. **Unknown means unknown.** Current FiveM/RedM behavior may inform research but cannot be silently promoted to a GTA VI guarantee.

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
