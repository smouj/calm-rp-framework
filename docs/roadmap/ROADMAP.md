# CALM Essentials Roadmap

**State:** ACTIVE planning reference
**Revised:** 2026-11-25 · Scope: [CALM Essentials framework (ADR-0007)](../adr/0007-calm-essentials-framework-scope.md)
**Method:** phases define **verifiable milestones**, not a schedule, and no GTA VI compatibility guarantee. This revision applies the evidence-based reorganization proposed in [ROADMAP_REVISION_2026-11-25.md](./ROADMAP_REVISION_2026-11-25.md) (owner-reviewed 2026-11-25).

The first tangible goal: **two simulated characters hold jobs, get paid, buy, store and trade items, and keep every byte of their data after the service restarts.** That is a functional roleplay base — even before any game integration exists.

## F0 — Project reformulation ✅ (completed 2026-11-25)

**Goal:** establish CALM Essentials as the working product name and define its original roleplay framework scope, independently of external frameworks and GTA VI runtime details.

- scope, architecture, roadmap, READMEs and the community site present the framework framing;
- history and valid code are preserved — no rewrite, no gratuitous breakage;
- the audit of the current code (present vs. missing) is published in [PROJECT_SCOPE.md](../PROJECT_SCOPE.md).

**Acceptance met:** this documentation batch, recorded in [ADR-0007](../adr/0007-calm-essentials-framework-scope.md).

**Scope note (2026-11-25):** F0 was a documentation, research and framing batch — it did not refactor the code. The runtime core remains the experimental in-memory reference without integrated persistence; that work is exactly what F1 delivers (see the present-vs-missing audit in [PROJECT_SCOPE.md](../PROJECT_SCOPE.md)).

## F1 — Persistence and characters ✅ (completed 2026-11-25)

**Goal:** connect accounts, characters and sessions to PostgreSQL and survive restarts.

- unified identifier representation and validation (resolve the string-vs-UUID mismatch);
- character creation, disconnect and recovery over durable storage;
- the ledger service **enforces balanced transactions** (double-entry invariant) with concurrency and recovery tests — the bootstrap migration alone does not guarantee it;
- session authentication feeding a trusted context (no client-supplied identity).

**Acceptance met:** a character created in one run is recovered intact in the next (restart suites: `tests/characters-persistent.test.ts`, `tests/session-authentication.test.ts`, `tests/ledger-double-entry.test.ts`), and concurrent financial writes are serialized and provably balanced (`tests/ledger-concurrency.test.ts` over the embedded PostgreSQL engine; `tests/postgres-live.test.ts` against a real server — gated on a `postgres://` `DATABASE_URL`; the prepared `ci(f1)` follow-up commit provisions the hosted `postgres:17` service). Delivery: canonical UUID identifiers (`packages/core/src/ids.ts`), the `@gta6-rp/persistence` package (migration runner, `pg` pool, embedded verification engine), additive migration `0002`, authenticated sessions, persistent characters and the double-entry ledger with idempotency, ownership and the reserved treasury. The existing eleven suites were kept green throughout; the workspace now runs eighteen suites.

## F2 — Economy and inventory

**Goal:** durable transactions, duplication prevention, containers and item movement.

- idempotent credit/debit/transfer across restarts;
- general containers (vehicle storage, warehouses, properties) with ownership **independent of physical location** (a weapon can belong to a character while stored in a vehicle);
- configurable capacity limits (observed game limits are defaults, never hard requirements);
- concurrent-request and restart tests.

**Acceptance:** simulated concurrent transfers and item movements never duplicate value; all state survives restart.

**Progress (2026-11-27):** F2's first delivery establishes the ownership/location ADR, additive PostgreSQL schema and typed store boundary. This is design and schema groundwork only; the transactional service/repository, simulator flow, restart coverage and real PostgreSQL race coverage are still required before F2 acceptance.

## F3 — Jobs and organizations

**Goal:** jobs, grades, duty state, salaries and organizations.

- `jobs.assign` / `jobs.setDuty`-class operations with permission checks;
- a full payroll cycle linked to a financial account (salary accrual → ledger credit);
- organizations as first-class owners (factions, businesses).

**Acceptance:** the first tangible goal above passes end-to-end in the simulator with persistent data.

## F4 — Independent resources (module system)

**Goal:** versioned module contracts, permissions and dependency resolution.

- two independently developed modules communicate through **public services only** (no reaching into another module's data);
- a CALM module manifest (name, version, dependencies, permissions, target) is proven before the extension system is formalized — see the [service-contracts proposal](../architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md);
- an external developer can add a resource without modifying the core.

**Acceptance:** a sample third-party-style module installs, resolves dependencies and persists its data against a published contract.

## F5 — Game adaptation

**State:** **BLOCKED** pending a public, authorized GTA VI integration path.

Before any real GTA VI adapter/client/server code:

1. verify allowed runtime/creator-platform scope and platform terms;
2. update [platform status](../research/PLATFORM_STATUS.md) and the relevant [RT requirements](../server/RUNTIME_REQUIREMENTS.md);
3. define a reviewed adapter contract, security model and ADR;
4. add conformance tests against a documented runtime;
5. implement a minimal reproducible proof of concept only after authorization.

PC-execution research (VIctory, XCL and forks) does not unlock this phase: executing the game offline is not a scripting, multiplayer or resource-execution interface. See [GTA6_EXECUTION_PROGRESS_2026-11-25.md](../research/GTA6_EXECUTION_PROGRESS_2026-11-25.md).

## Continuous practices (all phases)

- Maintain the [GTA VI capability matrix](../research/GTA6_CAPABILITY_MATRIX_2026-11-25.md) and [uncertainty register](../research/UNCERTAINTY_REGISTER_2026-11-25.md) per the [research protocol](../research/RESEARCH_PROTOCOL.md); watch GTA6-Asset-Info, the awesome index and enforcement actions.
- Watch, do not depend: monitor new verified APIs, technical documentation and license changes — not just FPS or stars — per the monitoring triggers in the roadmap revision.
- Simulator first: every domain rule is proven in the deterministic simulator before it becomes a published contract.
- Vehicle handling and world data stay project-owned synthetic data (design informed by public research metadata, never copied assets).
- Local verification (`bash scripts/verify-local.sh`) remains the authoritative gate for every phase.
