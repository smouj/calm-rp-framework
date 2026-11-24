# Community Platform Roadmap

**State:** ACTIVE planning reference  
**Reviewed:** 2026-11-23

Our goal is to build an independent community-led RP foundation **before** any GTA VI-specific integration becomes possible. The stages describe verifiable milestones, not a schedule or a guarantee of compatibility.

## P0 — Open-source project readiness

**Goal:** make the repository genuinely accessible, safe, understandable and legally clear.

- license original code under MIT; distinguish Rockstar intellectual property;
- English and Spanish onboarding, contribution rules, code of conduct and governance;
- badges, truthful status, public roadmap, bug/research templates and clear ownership;
- repository-history and Actions-log security audit before making an existing private repo public;
- CI that actually executes lint, type checks, tests and formatting on the final head;
- description, topics, Discussions, branch protection, dependency updates and security settings.

**Exit:** an unauthenticated visitor can clone a safe public repo, run checks and submit a documented PR. Follow the [public release checklist](../community/PUBLIC_LAUNCH_CHECKLIST.md).

## P1 — Shared RP system specification

**Goal:** define reusable game-independent requirements without overengineering a plugin framework.

- accounts and stable character identity;
- server-authoritative money, inventory, ownership, employment and permissions;
- example-server policies clearly separated from core rules;
- component naming, contract versioning, security invariants and example API scenarios;
- operational constraints and documented abuse cases.

**Exit:** individual contributions map to a reviewed domain/API use case and to explicit tests.

## P2 — Portable vertical slices

**Goal:** ship real, tested RP behavior in the simulator.

1. account and session lifecycle;
2. character creation and identity boundaries;
3. ledger-based wallet/bank operations with idempotent commands;
4. inventory, container and ownership transactions;
5. permission checks and attributable audit records;
6. deterministic two-player simulator workflows;
7. original synthetic world/location planning where it benefits tests; see [the in-memory planning catalog](../server/WORLD_SPATIAL_READINESS.md) (not persisted, not a game map).

**Exit:** multiple simulated players exercise a representative, secure RP flow with durable state. A diagram or stub is not a completed slice.

## P3 — Developer experience and reference integrations

**Goal:** make the verified systems easy for contributors and future server authors to use.

- API examples, complete fixtures, error contracts and conformance tests;
- admin/moderation samples and safe configuration;
- reproducible local services and migration tests;
- documented, minimal extension points driven by actual use cases;
- accessible UI prototypes, localization and developer documentation.

**Exit:** an external developer can understand, test and extend a supported component without GTA VI files.

## P4 — Public Cfx/engine research boundary

**Goal:** compare verified existing ecosystems without claiming GTA VI compatibility.

- documented FiveM/RedM/Cfx concepts, state/event and resource patterns;
- public Leonida technical findings about world/asset structure as research only;
- provenance, security, license and data-handling boundaries;
- explicit hypotheses and failure modes for future platform transitions.

**Exit:** useful research is documented with precise evidence classifications and no hidden integration assumptions.

## P5 — Authorized GTA VI runtime integration

**State:** **BLOCKED** pending public first-party documentation and an implementable, legitimate integration path.

Before any real GTA VI adapter/client/server code:

1. verify allowed runtime/creator-platform scope and platform terms;
2. update [platform status](../research/PLATFORM_STATUS.md) and relevant [RT requirements](../server/RUNTIME_REQUIREMENTS.md);
3. define a reviewed adapter contract, security model and ADR;
4. add conformance tests against a documented runtime;
5. implement a minimal reproducible proof of concept only after authorization.

**Exit:** only a separately verified implementation may claim GTA VI compatibility. P5 currently has **no release date**.

## P6 — Optional multiplayer prototype

**State:** Conditional on P5.

Only after authorized runtime support, evaluate real players, game-state sync, operations, security, voice, resources, client distribution and load. No prototype is currently playable or available to download.

## P7 — Public releases and community ecosystem

**State:** Conditional on working, documented and supportable functionality.

- release notes and security advisories;
- versioned APIs, compatibility matrices and deprecation policy;
- contributor governance and maintenance succession;
- optional plugins, server tooling and broader community services only if tested and justified;
- ongoing policy/license review before any game-facing release.

## Project rules

- **Implementation before claims:** a README or design document is not a functioning runtime.
- **Evidence before coupling:** FiveM patterns and third-party file research do not unlock GTA VI.
- **No game assets:** no proprietary files, leaked material, keys or unauthorized services.
- **Community with review:** contributions are open, merges remain gated on verification and human decisions for high-risk changes.
