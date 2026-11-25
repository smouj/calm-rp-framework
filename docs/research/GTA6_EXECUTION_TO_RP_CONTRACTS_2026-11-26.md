# GTA VI executable research vs. CALM RP integration contracts

**Observed:** 2026-11-26. **State:** PUBLIC TECHNICAL RESEARCH, NOT RUNTIME AUTHORIZATION.  
**Purpose:** prepare a GTA VI-specific interoperability design *from verifiable evidence*, rather than assuming that GTA V natives, Cfx APIs or single-player mechanics are multiplayer APIs.

## Sources and reproducibility

All findings below are from **public repository text** and original CALM documentation. No leaked executable, asset, shader dump, decompiled code, keys, disassembly, binary signatures or extracted tables were acquired, copied or executed.

- [Leonida Legacy, commit `f552464`](https://github.com/ProjectLeonidaL/leonida/tree/f5524640e6068050effb46f75c43575d9167994e), especially `README.md`, `docs/architecture.md`, `crates/leonida-hle/src/modules/xgameruntime.rs`, `crates/leonida-hle/src/modules/xnetworking.rs`, `crates/leonida-hle/src/modules/net.rs` and `crates/leonida-game/src/lib.rs`.
- [VIctory, commit `63bcca4`](https://github.com/Marvisak/VIctory/tree/63bcca43c6a00a758510398fa43096ce7e4f7df0), `README.md` and `docs/architecture.md`.
- [Rockstar GTA VI product](https://www.rockstargames.com/VI) and [Rockstar's official release notice](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available).
- CALM [platform status](./PLATFORM_STATUS.md), [runtime requirements](../server/RUNTIME_REQUIREMENTS.md), [research protocol](./RESEARCH_PROTOCOL.md) and [capability matrix](./GTA6_CAPABILITY_MATRIX_2026-11-25.md).

These repositories are rapidly changing; the **commit**, not the current default branch, is the reproducible observation. Their runtime benchmarks and screenshots are self-reported, not independently validated by CALM.

## 1. What the public code demonstrates

| Observation | Public evidence | Verified scope | CALM consequence |
| --- | --- | --- | --- |
| The Xbox title's x86-64 image is loaded in a Windows host process | Leonida `leonida-loader`; VIctory README | Experimental **game execution** | Define a *versioned compatibility profile* only when legitimate platform interfaces exist; not a server API |
| Platform APIs are supplied by console-service implementations | Leonida `xgameruntime.rs`: interface/provider lookup and offline service substitutes | **Emulated console environment**, not engine script exports | Keep CALM domains independent of console service IDs and method tables |
| File and package operations are virtualized into host storage | Leonida `docs/architecture.md` and `leonida-hle` | Offline loading/saves/streaming | Durable CALM state belongs in PostgreSQL, not a title save directory |
| Networking is intentionally offline | Leonida `xnetworking.rs`: offline connectivity; `net.rs`: loopback-only policy; VIctory README: title cannot reach network | **No demonstrated multiplayer transport** | RT-001, RT-005, RT-006, RT-007, RT-009 and RT-010 remain UNKNOWN |
| GPU programs and textures require host adaptation | Leonida `leonida-gpu`, `leonida-shader`, `leonida-formats` | Experimental graphics compatibility, not gameplay scripting | Do **not** include graphics conversions or extracted format data in CALM server packages |
| Title-specific build mapping is separated from platform code | Leonida `leonida-game/src/lib.rs` contains `KNOWN_BUILDS: &[]` in the reviewed commit | Design boundary exists; **no supported build declared in that array** | Version each future authorized adapter explicitly; do not guess offsets or rely on binary hooks |
| World/intro rendering has been reported | Leonida and VIctory READMEs | Self-reported incomplete single-player rendering | No evidence of spawning controlled multiplayer entities or running server-side resources |

**Technical distinction:** a title calling an Xbox SDK API is **not** the same thing as a community server being allowed or able to call a GTA VI gameplay API. Even a flawless, network-capable PC execution layer would not automatically provide player synchronization, script execution, entity ownership or server hosting.

## 2. What must be demonstrated before CALM binds to GTA VI

The minimum gate from `docs/server/RUNTIME_REQUIREMENTS.md` is:

| Gate | External GTA VI contract needed | Is it established by Leonida/VIctory? |
| --- | --- | --- |
| RT-001 | Authorized community-server or creator runtime | **No** |
| RT-003 | Documented scripting / execution model | **No** |
| RT-005 | Trusted player/account identifiers and authentication | **No** |
| RT-006 | Client-to-server events/RPC and trust boundaries | **No** |
| RT-007 | Server-to-client state/event delivery | **No** |
| RT-010 | Player connection/disconnection lifecycle | **No** |
| RT-008 / RT-009 | Entity creation, ownership and replication for actual gameplay | **No** |
| RT-015 / RT-016 / RT-017 | UI, voice and resource packaging for those features | **No** |

No source above establishes a Rockstar-approved way for third parties to run GTA VI roleplay servers. The official GTA V/Cfx model cannot be carried across as a confirmed GTA VI contract.

## 3. Architecture that follows from this evidence

This is *not* an invention of GTA VI natives. It is a set of **CALM-owned, engine-independent invariants** justified by the gaps above.

- **Durable vs. transient identity:** character, vehicle and container UUIDs remain stable through process restarts. An adapter maps them to ephemeral game entity handles only when a real, documented runtime exists.
- **Authority:** a server-created session resolves an account; clients submit intents, never an authoritative balance, rank, owner, evidence result or identifier.
- **Communication:** domain commands and emitted events stay transport-neutral. Transport retries are idempotent; ordering and reconciliation must be conformance-tested against the eventual documented runtime.
- **Persistence:** F1's PostgreSQL ledger, characters and sessions persist independently from title save files; F2 container ownership is distinct from where an item is physically stored.
- **Capability negotiation:** each adapter advertises only functions it can actually implement and has exercised in a conformance suite. Unknown capabilities fail closed; no GTA VI capabilities are currently activated.
- **Version discipline:** record a game/runtime/adapter version triple, supported feature set and test results. An unknown future build fails closed instead of falling back to undocumented memory assumptions.
- **Adapter seams:** character representation, world interaction, vehicles, entity lifetime, UI and voice remain optional projections over independently working domain services.

## 4. Research-to-code decision table

| Finding | Action now | Deferred until an authorized API exists |
| --- | --- | --- |
| Standalone console services, loader and save systems | Preserve a separate `adapters/gta6` boundary and test version/capability failures | Any GTA VI-specific loader/hooking and actual game process communication |
| Offline networking in Leonida/VIctory | Implement session provenance, command authorization and event schemas in CALM's simulator | Network/replication adapter against a defined public server protocol |
| Complex game asset streaming | Keep synthetic item/model descriptors, not game assets | Translate documented entity/resource identifiers only through licensed APIs |
| Persisted RP ownership, independent of game process | Complete F2 inventory, vehicles-as-data and restart tests | Actual vehicle spawn, interior use, doors, props and visual attachments |
| Shared gameplay with future online players | Test parallel commands, reconciliation and anti-duplication against real PostgreSQL | Real player connection/disconnection, authority transfer, interpolation and streaming |

**Prohibited shortcuts:** importing GPL code into the MIT core without license review, adding content from a leaked title build, treating undocumented game offsets as a server API, fabricating native function names, or changing an RT state to CONFIRMED based on a compatibility layer.

## 5. Mechanical research gate

`@gta6-rp/contracts` provides `inspectGta6RuntimeEvidence` and the minimum RT list. Its input is **maintainer-curated metadata**, never a remote-client payload. It distinguishes official GTA VI runtime claims from gameplay observations, simulator tests and execution research. It reports missing first-party contracts and missing conformance tests.

**Crucially:** the function does *not* authenticate URLs, verify licenses, issue permission or enable an adapter. Even a structurally complete test fixture is only **eligible for human review**. `GTA6_UNVERIFIED_CAPABILITIES` remains empty. Actual promotion requires Rockstar/Cfx first-party evidence, explicit authorization/legal review, approved ADR and successful runtime-specific conformance tests.

## 6. Next changes justified now

1. **F1 follow-up:** finish trusted HTTP/API session integration, request validation, rate limits and attributable privileged operations.
2. **F2:** finalize item-vs-owner-vs-container identities; persistent concurrent transfers with PostgreSQL and simulator verification.
3. **F3:** organizations and vehicle/property ownership with explicit references, never transient engine entity handles as database IDs.
4. **F4:** publish a versioned capability/contract manifest with a simulator consumer and a second independently authored module.
5. **F5:** only upon first-party support, implement an actual narrow GTA VI adapter for one end-to-end interaction, with on-platform tests and rollback/version compatibility.

**Rule:** learn the title's real *constraints* from legal, reproducible public research. Do not claim to know a future multiplayer programming contract from the fact that a leaked single-player executable can run.
