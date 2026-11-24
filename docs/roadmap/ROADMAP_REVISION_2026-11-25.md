# Roadmap revision — evidence-based reorganization proposal

**Date:** 2026-11-25 · **Status:** PROPOSAL (requires human review; no gate advances
without it) · **Replaces nothing unilaterally:** this file reorganizes priorities around
[verified evidence](./research/GTA6_CAPABILITY_MATRIX_2026-11-25.md) and proposes
concrete edits to `docs/roadmap/ROADMAP.md`.

## What the evidence says (inputs to this revision)

1. P5 remains fully blocked: no authorized GTA VI runtime path, no PC release confirmed,
   no scripting/networking contract, all `RT-*` UNKNOWN.
2. A leak exists, enforcement is aggressive (Leonida DMCA, 3,007 forks; Take-Two CEO
   statements) — research inputs must stay strictly legal; several tool classes depend on
   the leaked executable and are therefore non-admissible for us.
3. QBCore's org moved to an engine-agnostic UE5 platform (Mantle): the market is
   rewarding game-agnostic RP infrastructure — exactly CALM's lane.
4. Public format research (RPF9/PSO/BCPack/navmesh/road graph) is rich and maturing —
   useful as _design reference_ and _conformance-test inspiration_, never as adapter code.

## Priority reorganization

### Now — components with independent utility and zero GTA VI dependency

| Priority | Work                                                                                                                                                    | Why now                                      | Maps to                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------- |
| 1        | Finish P2 vertical slices: economy, inventory, permissions, sessions, character lifecycle                                                               | Deliverable value independent of any game    | ROADMAP P2                    |
| 2        | Simulator: two-player deterministic RP scenarios incl. vehicles-as-data (handling profiles inspired by public RE metadata, expressed as our own schema) | Tests authority rules cheaply                | P2.6, capability-matrix row 6 |
| 3        | Evidence-gate tooling: promote the Phase-7 PoC (synthetic capability-manifest checker) into a repo test utility                                         | Mechanizes RESEARCH_PROTOCOL promotion rules | New (P4 tooling)              |
| 4        | Capability-matrix maintenance procedure (below)                                                                                                         | Keeps GTA VI knowledge current without noise | P4                            |

### Re-sequenced — validated design, still no runtime dependency

| Priority | Work                                                                                                                         | Condition                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 5        | Coordinate-adapter contract with configurable conventions (Z-up documented as RAGE-9-observed, selectable, versioned)        | Pure TS contract + simulator tests |
| 6        | Character identity/appearance data model (portable traits; representation deferred)                                          | ADR-0001 already allows            |
| 7        | Conformance-test harness blueprint for future adapters (fail-closed capability manifests, version pins, rollback discipline) | Design doc + synthetic tests only  |

### Locked — with explicit unlock requirements

| Locked capability                            | Unlock requirement (must all be first-party)                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Any `adapters/gta6` implementation           | The complete checklist in `PLATFORM_STATUS.md` (16 items) + `RT-001/003/005/006/007/010` CONFIRMED minimum path    |
| Multiplayer prototype (P6)                   | P5 unblocked + authorized runtime + conformance tests green                                                        |
| FiveM/Cfx adapter work                       | Explicitly out of scope unless project pivots; Cfx research stays documentation-only                               |
| Asset conversion paths (6to5m-class tooling) | Rejected permanently under current IP policy; would require a legal review that no public tooling currently passes |

### Monitoring triggers (no implementation, watch only)

- Official GTA VI PC date → re-evaluate U-03, publish note; nothing else changes.
- Any first-party GTA VI online/creator/PC announcement → full `PLATFORM_STATUS.md` pass first.
- New Take-Two enforcement against RE projects → record; assess citing-risk of affected repos.
- Q1 2027 window passes without PC release → mark U-03 rumor stale; do not re-plan around it.

## Concrete edits proposed for `docs/roadmap/ROADMAP.md`

1. P2 gains an explicit item: "vehicle handling profiles as project-owned data (synthetic)".
2. P4 gains: "maintain `GTA6_CAPABILITY_MATRIX_*.md` and `UNCERTAINTY_REGISTER_*.md` per
   `RESEARCH_PROTOCOL.md`; add GTA6-Asset-Info, the awesome-list index and enforcement
   actions to the watch set".
3. P5 header gains: "Blocked as of 2026-11-25 (verified: no authorized path, no PC, no
   contract; see capability matrix + uncertainty register)".
4. Project rules gains: "No leak-derived inputs; no tooling that requires the leaked
   executable to function."
5. `docs/roadmap/RISK_REGISTER.md` gains rows: R-leak-taint (reputational/legal),
   R-malware-wave (community harm), R-market-validation (opportunity: QBCore→Mantle).

## Rule of the revision

**Investigate first, demonstrate second, build only what is actually known** — the
roadmap's center of mass stays in components whose value survives every scenario,
including "GTA VI never opens" (ADR-0002's independence test).
