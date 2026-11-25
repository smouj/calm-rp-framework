# Architecture comparison — CALM vs FiveM/RedM, QBCore/Mantle, Qbox, ESX

**Date:** 2026-11-25 · **Scope:** Phase 4 of the research mission — determine which
programming patterns remain adequate, which must evolve, and which are GTA V-specific.
Companion to [GTA6_CAPABILITY_MATRIX_2026-11-25.md](../research/GTA6_CAPABILITY_MATRIX_2026-11-25.md).

## Compared systems (verified states, 2026-11-25)

| System                           | What it is today                                                                                                                                                                                     | Verified status                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FiveM (Cfx.re, part of Rockstar) | Client+server modification platform for **GTA V** (Legacy & Enhanced); FXServer; Lua/JS/C# runtimes; OneSync; state bags; NUI                                                                        | CONFIRMED, GTA V only           |
| RedM                             | Same platform for RDR2                                                                                                                                                                               | CONFIRMED, RDR2 only            |
| QBCore                           | Roleplay framework; the org rebranded around **Mantle**, a UE5 multiplayer world-creation platform; "no longer pursuing implementations for other platforms"; new implementation developed privately | CONFIRMED (org README, 2026-11) |
| Qbox                             | Maintained QBCore successor **on FiveM**; claims 97.99% QBCore resource compatibility                                                                                                                | CONFIRMED (project site)        |
| ESX Legacy                       | Long-standing FiveM RP framework; maintained                                                                                                                                                         | CONFIRMED                       |
| CALM                             | Game-agnostic RP domain core (TS), PostgreSQL authoritative, deterministic simulator, reserved adapters                                                                                              | This repository                 |

## Pattern-by-pattern verdict

| Pattern                                                     | Where it comes from                                               | Verdict for CALM          | Reason                                                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Server-authoritative domain (money, inventory, permissions) | All mature frameworks                                             | **Keep** (already core)   | Client is untrusted in every ecosystem; enhanced by FiveM's own server-security guidance                         |
| Event/RPC split (intent → validate → transact → project)    | FiveM events                                                      | **Keep, in neutral form** | CALM's `intent.receive`/`projection.send` already re-expresses it without Cfx names                              |
| Durable identity separated from transient runtime IDs       | FiveM Enhanced (player IDs reused on disconnect — Cfx-documented) | **Keep**                  | External corroboration that runtime IDs must never be durable keys (identifier deprecations 2026-04/06)          |
| Ledger-based money with idempotent commands                 | Qbox/ESX patterns                                                 | **Keep**                  | Integer minor units + audit is strictly stronger than typical framework wallets                                  |
| Per-resource scripting sandbox                              | FiveM resources                                                   | **Evolve**                | CALM: modular monolith first (ADR-0003); no plugin ABI until real use cases exist                                |
| State bags / client-server sync model                       | FiveM Enhanced specifics                                          | **Exclude from core**     | GTA V-ecosystem semantics; GTA VI sync model unknown (RT-009)                                                    |
| Natives/game-API calls inside domain logic                  | QBCore/ESX resources                                              | **Exclude** (already)     | Core is game-agnostic; adapters own all game calls                                                               |
| stream/stream_enhanced asset variants                       | FiveM Enhanced migration guide                                    | **Research only**         | GTA V-specific packaging; GTA VI resource rules unknown (RT-017)                                                 |
| Server-list/portal metadata split                           | Cfx Portal (2026-10)                                              | **Note for ops design**   | Discovery/publishing metadata managed externally — keep as adapter-owned operational concern, not domain         |
| Version-coupled client/server protocol discipline           | FiveM Enhanced patch notes (2026-09-30)                           | **Keep as ops rule**      | Compatibility matrix + rollback discipline already in CALM ops docs                                              |
| Engine-agnostic platform direction                          | QBCore → Mantle (UE5)                                             | **External validation**   | The largest RP framework family moved off a GTA-specific runtime; CALM's bet is consistent with market direction |
| Deterministic simulator as first runtime                    | CALM original                                                     | **Keep**                  | Lets P1-P3 progress with zero proprietary inputs; also our conformance harness                                   |

## What GTA VI evidence changes

1. **Nothing in the public RE record contradicts CALM's design.** The strongest new data
   (script-data PSIN/LSCH framing, vehicle handling records, world/interior structure)
   is _data layout_ knowledge — it confirms the wisdom of keeping the domain free of
   game formats, because those formats remain writable-read-only even to the RE scene
   (TOC encrypted; BCPack not byte-exact; semantics unresolved).
2. **The one thing GTA VI evidence does stress:** coordinate conventions (Z-up per SixNG
   research) and vehicle metadata richness. Both land in **versioned adapter profiles**
   (configurable coordinate adapters, data-driven vehicle handling profiles), never in
   the core — exactly as the research mission requires.
3. **Enforcement risk (Take-Two DMCA wave, CEO statements) argues for zero leak-derived
   dependencies**, keeping CALM's research input strictly to public documentation,
   public code with licenses, and media reports.

## Audit conclusion (Phase 5)

Reviewed: `ARCHITECTURE.md`, all 6 ADRs, `packages/contracts` (runtime-port), core
modules, `docs/research/*`, `docs/roadmap/*`, `docs/server/*`, legal docs.

- **No incorrect architectural assumption was found.** No ADR contradicts the 25-Nov
  evidence; no GTA V-specific pattern leaked into `packages/*`.
- **Premature decisions:** none found. The deliberately _deferred_ decisions (adapter
  language, event transport) remain correctly deferred (RT-003/004/006/007 UNKNOWN).
- **Unnecessary abstractions:** none identified at current scale; `runtime-port.ts`
  fail-closed contract is minimal and already tested by existing suites.
- **Documentation deltas to apply (low-risk, this pass):** record the Leonida DMCA cause
  (was "404, unknown cause" on 24-Nov), add GTA6-Asset-Info to the pinned tool layer,
  note the TOC-decryptor class of tools (OpenSix/forge9) as prohibited-input dependent,
  and add the QBCore→Mantle market signal. Delivered as a reviewable patch; nothing is
  auto-merged.
- **Improvement adopted this pass:** the capability matrix becomes the canonical
  engine-knowledge catalog (new), the uncertainty register (new), and a synthetic
  evidence-gate checker PoC (Phase 7) demonstrating the promotion rules mechanically.

## Non-equivalences to keep explicit

Do **not** invent equivalences between: FiveM natives ↔ GTA VI internals; Qbox exports ↔
CALM contracts; state bags ↔ unknown GTA VI sync; nopixel V distribution ↔ GTA VI RP
distribution; Cfx Portal ↔ any GTA VI ops surface; Mantle's UE5 scripting ↔ CALM's TS
domain. Each row of the capability matrix exists precisely to keep these apart.
