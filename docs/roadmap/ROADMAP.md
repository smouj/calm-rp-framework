# CALM Essentials Roadmap

**State:** ACTIVE planning reference
**Revised:** 2026-11-27 · Scope: [GTA VI-first CALM product (ADR-0009)](../adr/0009-gta-vi-first-product-scope.md)
**Method:** phases define **verifiable milestones**, not a schedule or GTA VI compatibility guarantee. CALM is GTA VI-first; simulator and persistence work are ways to build its target-specific RP systems before an authorized game runtime exists.

The first tangible goal: **a CALM GTA VI RP slice in which two characters hold jobs, get paid, buy, carry, store and trade items, and keep their state after restart.** The simulator proves CALM's domain behavior; it does not emulate GTA VI or establish runtime compatibility.

## F0 — Project reformulation ✅ (completed 2026-11-25)

**Goal:** establish CALM Essentials as an original GTA VI-first roleplay product, with requirements derived from target-game behavior evidence and integration claims gated on authorized runtime documentation.

- scope, architecture, roadmap, READMEs and the community site state the GTA VI-first target and separate RP behavior from runtime integration;
- history and valid code are preserved — no rewrite, no gratuitous breakage;
- the audit of the current code (present vs. missing) is published in [PROJECT_SCOPE.md](../PROJECT_SCOPE.md).

**Acceptance met:** the original framework scope was recorded in [ADR-0007](../adr/0007-calm-essentials-framework-scope.md) and the owner-directed GTA VI-first product target is recorded in [ADR-0009](../adr/0009-gta-vi-first-product-scope.md).

**Scope note:** F0 was a documentation, research and framing batch. ADR-0009 records the later owner-directed GTA VI-first product target; this scope correction does not claim game-runtime integration.

## F1 — Persistence and characters ✅ (core milestone delivered 2026-11-25)

**Goal:** connect accounts, characters and sessions to PostgreSQL and survive restarts.

- unified identifier representation and validation (resolve the string-vs-UUID mismatch);
- character creation, disconnect and recovery over durable storage;
- the ledger service **enforces balanced transactions** (double-entry invariant) with concurrency and recovery tests — the bootstrap migration alone does not guarantee it;
- session authentication feeding a trusted context (no client-supplied identity).

**Acceptance met:** a character created in one run is recovered intact in the next (restart suites: `tests/characters-persistent.test.ts`, `tests/session-authentication.test.ts`, `tests/ledger-double-entry.test.ts`), and concurrent financial writes are serialized and provably balanced (`tests/ledger-concurrency.test.ts` over the embedded PostgreSQL engine; `tests/postgres-live.test.ts` against a real server — gated on a `postgres://` `DATABASE_URL`; the prepared `ci(f1)` follow-up commit provisions the hosted `postgres:17` service). Delivery: canonical UUID identifiers (`packages/core/src/ids.ts`), the `@gta6-rp/persistence` package (migration runner, `pg` pool, embedded verification engine), additive migration `0002`, authenticated sessions, persistent characters and the double-entry ledger with idempotency, ownership and the reserved treasury. The existing eleven suites were kept green throughout; the 2026-11-25 F1 delivery snapshot ran eighteen suites. The 2026-11-27 workspace contains twenty Vitest files after the F2 additions; see the release-readiness record for the current run and skipped live-database limits.

**F1 issue status:** the persistence foundation above is delivered. Repository issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) remains open for the wider authenticated API/transport, attributable privileged-grant audit, request limits, lost-connection/failure coverage and threat-model review; do not describe that whole issue as complete.

## F2 — GTA VI RP economy, carried items and storage

**Goal:** durable transactions, duplication prevention, containers and item movement.

- idempotent credit/debit/transfer across restarts;
- CALM-owned storage for character-carried items, vehicle storage, properties and warehouses, with item ownership **independent of physical location** (an item may remain character-owned while stored in a vehicle);
- carry/storage capacity as explicit CALM RP rules informed by public gameplay observations; observed campaign limits are design inputs, not assumed multiplayer limits;
- equipment/loadout state as a distinct follow-on domain; the F2 container service does not claim to implement it;
- concurrent-request and restart tests.

**Acceptance:** simulator flows preserve ownership while objects change storage; competing real PostgreSQL 17 transfers never duplicate or lose stock; embedded PostgreSQL close/reopen recovers state and idempotent receipts; failed operations leave no partial audit or stock mutation.

**Progress (2026-11-27):** F2 includes the additive schema, authenticated transactional service/repository, simulator flow, capacity and rollback checks, and embedded restart recovery. The live PostgreSQL 17 multi-connection suite must pass on the exact pull-request head before acceptance.

## F3 — Jobs and organizations

**Goal:** jobs, grades, duty state, salaries and organizations.

- `jobs.assign` / `jobs.setDuty`-class operations with permission checks;
- a full payroll cycle linked to a financial account (salary accrual → ledger credit);
- organizations as first-class owners (factions, businesses).

**Acceptance:** the first tangible goal above passes end-to-end in the simulator with persistent data.

## F4 — CALM domain modules (deferred)

**State:** **DEFERRED** until multiple concrete GTA VI RP workflows justify a module boundary.

If CALM's own domains need separate modules, define versioned internal contracts and permissions from those tested workflows. A third-party manifest, executable extension ABI or resource marketplace is not implied; evaluate external execution only after an authorized GTA VI runtime and a threat model exist.

**Acceptance:** two CALM-owned GTA VI RP domains communicate through reviewed services without reaching into one another's storage. External modules remain out of scope unless a specific workflow and authorized runtime require them.

## F5 — Game adaptation

**State:** **BLOCKED** pending a public, authorized GTA VI integration path.

Before any real GTA VI adapter/client/server code:

1. verify allowed runtime/creator-platform scope and platform terms;
2. update [platform status](../research/PLATFORM_STATUS.md) and the relevant [RT requirements](../server/RUNTIME_REQUIREMENTS.md);
3. define a reviewed adapter contract, security model and ADR;
4. add conformance tests against a documented runtime;
5. implement a minimal reproducible proof of concept only after authorization.

Unofficial PC execution and compatibility experiments do not unlock this phase: executing a title locally is not a scripting, multiplayer or resource-execution interface. Detailed project-by-project research is maintained outside CALM; the framework waits for a public, authorized GTA VI contract.

## Continuous practices (all phases)

- Maintain the [CALM uncertainty register](../research/UNCERTAINTY_REGISTER_2026-11-27.md) per the [research protocol](../research/RESEARCH_PROTOCOL.md), using official platform/runtime sources and documented gameplay evidence.
- Keep external port, reverse-engineering and framework-comparison research in its separate documentary repository; never turn performance claims or file-format findings into CALM runtime contracts.
- Simulator first: every domain rule is proven in the deterministic simulator before it becomes a published contract.
- Vehicle handling and world data stay project-owned synthetic data (design informed by public research metadata, never copied assets).
- Local verification (`bash scripts/verify-local.sh`) remains the authoritative gate for every phase.
