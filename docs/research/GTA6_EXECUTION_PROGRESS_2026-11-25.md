# GTA VI execution progress — PC execution research and what it is not

**Compiled:** 25 November 2026 · **Verification date:** every primary source was re-opened and re-read on 2026-11-25 before publication
**Method:** public third-party repositories and filings only; no leaked builds, executables, keys or game files were downloaded, run or incorporated
**Companion files:** [GTA6_CAPABILITY_MATRIX_2026-11-25.md](./GTA6_CAPABILITY_MATRIX_2026-11-25.md) (engine/format knowledge) · [UNCERTAINTY_REGISTER_2026-11-25.md](./UNCERTAINTY_REGISTER_2026-11-25.md) (open unknowns)

There is real technical progress in executing GTA VI on PC. For CALM Essentials three different problems must be kept apart: **executing the game**, **partially understanding its technology**, and **having interfaces to build a roleplay framework on it**. Recent events only concern the first two.

## Verified findings (each source re-opened 2026-11-25)

| Finding                                   | Evidence                                                                                                                                                                                                                                                                                                                                                                   | Class                                                                        | Limits                                                                                                                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VIctory executes parts of the world on PC | Project README (2026-11-23 state): title boots, menus run at 30 fps, the world loads; world rendering fails (dark scene); 0.5–1.8 s per frame in the world; shader translation progress mesh 8,191/8,506, vertex/pixel 10,617/12,346, compute 1,643/2,539; **offline by design** — the title cannot reach the network. GPL-3.0-or-later.                                   | `PUBLIC_OBSERVED` (developer-declared; not independently reproduced by CALM) | Entering the world on a real GPU can hang the system; no gameplay, no online                                                                                                                              |
| fxceless fork reaches ≈2.5–4 fps          | Fork README: characters, textures, sky, sunlit exteriors, HUD, pause menu and gamepad input render; 420–450 ms/frame (240–350 ms with switches); hardware declared: Windows 11, i7-14700KF, RTX 4070 12 GB, 32 GB RAM (Series X profile). GPL-3.0-or-later.                                                                                                                | `PUBLIC_OBSERVED` (developer-declared)                                       | Everything in shadow renders black; ray-traced bounce light and ray-traced shadows do not run                                                                                                             |
| XCL compatibility layer                   | Project README: 100% of a retail game's 26,698 RDNA2 shader programs translate to HLSL with 0 errors on random samples; `kernelx` implemented and verified; `XGameRuntime` with all 396 GDK functions; Minecraft Preview and Unicorn Overlord fully playable; Fortnite and XDefiant work without online services; a newer retail game starts and runs menus. GPL-2.0-only. | `PUBLIC_OBSERVED` (developer-declared)                                       | "A newer retail game starts and runs menus, not gameplay" — no online networking for GTA VI is claimed or provided                                                                                        |
| Leonida takedown                          | Published DMCA notice: filed by Take-Two IP Enforcement on 2026-11-24 against `ItsNotRexed/Leonida` ("A Native PC Recompilation Of The Xbox Version Of Grand Theft Auto 6") and its fork network — 2,900+ forks, 3,007 repositories in total; the notice references the 2026-11-20 Xbox build leak.                                                                        | `CONFIRMED` (first-party filing published by GitHub)                         | An allegation by the rights holder, not a court judgment; but a real, documented enforcement signal                                                                                                       |
| gta6recomp.com tracker                    | Unofficial community tracker; content changes daily. On our 2026-11-25 verification it listed Trinitron (rank 1) and Leonida (rank 2) with self-defined phase percentages. Earlier reporting attributes ≈5 fps to omonkey and ≈3 fps to Hyphen (RTX 4090).                                                                                                                 | `RUMOR`-level for CALM purposes                                              | Progress percentages are the tracker's own metrics, not a standardized technical evaluation; omonkey's code is not public and could not be audited; **none of these figures are used for CALM decisions** |

The tracker's earlier omonkey/Hyphen figures could not be re-verified directly and must not be used as an architectural input, exactly like the capability matrix's rules for unverified claims.

## Additional reviewed fork: myokex/victory-amd (2026-11-25)

**Source:** [`myokex/victory-amd`, branch `victory-amd`](https://github.com/myokex/victory-amd/tree/victory-amd), pinned at [`070df424b0967dca422478a1f12afaaf6736ebdd`](https://github.com/myokex/victory-amd/commit/070df424b0967dca422478a1f12afaaf6736ebdd) on 2026-11-25. **Classification:** `PUBLIC_OBSERVED` — code inspected and README claims reviewed, but measurements were **not** independently reproduced by CALM.

- This is an AMD-oriented fork of `fxceless/victory-fork` (itself a VIctory fork), licensed GPL-3.0-or-later. The author reports booting the prologue and moving a character at **2–3 FPS** on a single Windows 11 machine with a Radeon RX 7800 XT; intermittent missing walls, white frames and a `DXGI_ERROR_DEVICE_HUNG` remain. These are developer-reported, single-machine measurements, **not** a general compatibility claim.
- The current fork adds [cross-view physical-page write tracking](https://github.com/myokex/victory-amd/commit/c6dc4d8c9fc80e8d2090f94287827cd3ffc0ac95) and [post-upload texture rechecks](https://github.com/myokex/victory-amd/commit/1daf3fd1ff5ff7a838b42c6287b3df331164cf02). Both address texture/memory correctness, not a scripting or server contract.
- The checked source under `crates/victory-hle/src/modules/net.rs` and `xnetworking.rs` deliberately restricts external network access; `victory-game/src/lib.rs` has an empty `KNOWN_BUILDS` catalog, not an RP function registry. Neither file provides GTA VI player/entity APIs or a resource execution interface.
- `docs/fork-ray-tracing.md` reports shader translation progress and explicitly says end-to-end ray-traced lighting is **not running**; the work does not enable any GTA VI `RT-*` requirement.
- **CALM impact:** add the fork to the external research watch for interface/format findings and license changes only. No GPL code, proprietary data, leaked game files or runtime assumptions enter this MIT repository; F5 remains blocked.

## What this changes for CALM Essentials

The obstacle for CALM Essentials is not only running GTA VI on PC — it is obtaining a **resource-execution interface that can be used legally and kept stable**. Concretely:

1. VIctory is **offline by design**: even perfect single-player rendering proves nothing about multiplayer, servers or resource loading.
2. Executing game code, rendering characters or loading entities is **not** evidence of a scripting API available to CALM.
3. XCL's breadth shows compatibility layers are far more than x86-64 instruction translation — but their achievements remain single-player emulation of console services.

## What is still missing for an ESX-equivalent

| Capability                                         | Public verified GTA VI interface? |
| -------------------------------------------------- | --------------------------------- |
| Obtain the player associated with a session        | No                                |
| Create and control characters from a resource      | No                                |
| Query or modify entities via a public API          | No                                |
| Create vehicles via third-party scripts            | No                                |
| Register custom client/server events               | No                                |
| Render custom interfaces inside the game           | No                                |
| Execute independent modules/resources              | No                                |
| Use an external database from an authorized server | No                                |
| Manage the GTA VI resource lifecycle               | No                                |

"Not verified" means no public, authorized interface is established — not that the engine is incapable. These rows align with the 22 `RT-*` requirements still marked UNKNOWN in [RUNTIME_REQUIREMENTS.md](../server/RUNTIME_REQUIREMENTS.md).

## RAGE 9 format research — conceptual relevance only

The format research cataloged in the capability matrix informs CALM's **data modeling**, never implementation:

| Technology researched | What it represents                 | Conceptual application for CALM                          |
| --------------------- | ---------------------------------- | -------------------------------------------------------- |
| RPF9                  | Resource containers                | Separation between resources and RP logic                |
| TTPF / BCPack         | Textures and compression           | Design of visual-resource metadata (if ever needed)      |
| PSIN / PSO            | Serialized data                    | Typed models and data validation discipline              |
| Spatial data          | Locations and world representation | Regions, interiors and properties in our synthetic model |
| Models and animations | Entity representation              | Persistent identities independent of the visual model    |
| ADAT / AWC            | Audio resources                    | Separation of media and services                         |
| Vehicle data          | Configurations and characteristics | Extensible, project-owned vehicle profiles               |

CALM needs **no GTA VI models, textures or extracted files** to implement a good RP system: a vehicle with owner, plate, access permissions, state and containers can be designed without knowing its RAGE 9 internal identifier. When a legitimate interface exists, an adapter can associate the persistent record with a game entity.

## Licensing and provenance controls

- VIctory and its fork are GPL-3.0-or-later; XCL is GPL-2.0-only. CALM is MIT: **no code or fragments are transplanted** from these implementations.
- The Take-Two filing challenges the "we only distribute code, not the executable" defense. It is the rights holder's position, not a judgment, but projects whose viability depends on proprietary material should treat it as a material risk.
- The admissible research inputs remain: public format documentation with no game files (e.g. GTA6-Asset-Info notes), clean-room decoders, and first-party statements. Leaked-executable-dependent tooling stays inadmissible per [THIRD_PARTY_ARTIFACT_POLICY.md](../operations/THIRD_PARTY_ARTIFACT_POLICY.md).

## Research register format (proposal)

Every finding will be recorded with a card like the one below. **The values shown are illustrative placeholders, not a discovered GTA VI function:**

```yaml
id: RAGE9-RESEARCH-001
subject: 'Entity representation'
source_type: 'Third-party research'
source_url: 'URL of the research'
reviewed_at: '2026-11-25'
evidence: 'Pending independent validation'

calm_impact:
  - 'Keep our own persistent identifiers'
  - 'Separate domain entities and runtime representation'

gta6_api_confirmed: false
implementation_authorized: false
```

## Follow-up cadence

Because these repositories change practically daily, the monitoring set tracks **new verified APIs, technical documentation and license changes — not FPS or stars** — per [AUTONOMOUS_RESEARCH.md](./AUTONOMOUS_RESEARCH.md) and the monitoring triggers in [ROADMAP_REVISION_2026-11-25.md](../roadmap/ROADMAP_REVISION_2026-11-25.md). Priority watch list: [VIctory](https://github.com/Marvisak/VIctory) · [XCL](https://github.com/xcl-dev/xcl) · [fxceless fork](https://github.com/fxceless/victory-fork) · [Awesome GTA VI RE](https://github.com/Ahmet-Dedeler/awesome-gta6-reverse-engineering) · [gta6recomp tracker](https://gta6recomp.com/repo) (informatively) · [Xbox2Windows](https://github.com/R0Y00/Xbox2Windows) (low priority).
