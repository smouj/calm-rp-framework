# GTA VI technical research snapshot — 24 November 2026

**Evidence class:** publicly observable third-party projects and media reports; NOT an official GTA VI scripting API or a verified multiplayer runtime.

## Leak claim versus GitHub source repositories

CyberLeek has claimed distribution of approximately 209 GB of Xbox GTA VI game-build data and, later, an executable. Neither authenticity, integrity, redistribution rights nor the claimed completeness are independently confirmed by this project. Public GitHub repositories inspected by the community principally host research code, format notes, and tools; do not claim GitHub hosts the full 209 GB build. Hashes alone cannot establish publisher authenticity. A decompiler/recompiler project is not equivalent to the original Rockstar source code.

Selected public documentation/tool repositories (not vetted, no endorsement):

- https://github.com/ItsNotRexed/Leonida — historical recompilation/format research; **original repository returned 404 on 24 November 2026**. Verified 25 November 2026 as a Take-Two DMCA takedown processed by GitHub on 2026-11-24 covering the repository and its 3,007-fork network; community reference copies and continuations exist but can vanish the same way. Do not rely on this as an available code source.
- https://github.com/Ahmet-Dedeler/rage9-re — from-scratch Rust/Python readers describing `PSIN` script-data containers and animation structure; **not a public scripting API**.
- https://github.com/holdmysocks/SixNG — RPF9/model/texture/world format/tooling observations; GPL-3.0.
- https://github.com/TrinitronClient/GTA6-Asset-Info — 19-part asset-format specification maintained by the SixNG team; GPL-3.0; explicitly documentation-only (no game files, no keys); see [GTA6_CAPABILITY_MATRIX_2026-11-25.md](./GTA6_CAPABILITY_MATRIX_2026-11-25.md).
- https://github.com/breadbbbb/rpf9-explorer — RPF9 research tools.
- https://github.com/nullbrik/RageForge — RAGE archive and world research.
- https://github.com/R0Y00/Xbox2Windows — console compatibility experimentation; reported partial diagnostic boot with full game not verified.
- https://github.com/Marvisak/VIctory — developer-reported offline menus and incomplete world rendering; **not playable and no networking**.
- https://github.com/Ahmet-Dedeler/awesome-gta6-reverse-engineering — curated community index; used as the discovery layer for the capability matrix.

**These sources make claims about their own implementations.** No compatibility or legal authorization should be inferred from their existence. Do not copy GPL/copyleft sources into the MIT project without compatibility and licensing review.

## API reality check

**No independently reproducible, authorized GTA VI scripting function list or RPC/network contract was found in the inspected public research**. In particular, `PSIN`, `LSCH` and related `script.rpf` entries exposed by third-party tooling are serialized data-format markers, **not functions we can call from a GTA VI server**.

Existing FiveM/Cfx event functions and Qbox/QBCore exports are real and documented **only for their own supported runtime**. Our verified correspondence matrix and original portable contract are in [FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md](./FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md). The legal assessment is [INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md](../legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md).

## Implications for the independent RP core

| Observation/research topic             | Portable abstraction we can build                            | Runtime-dependent assumption still blocked           |
| -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| World coordinate spaces and interiors  | Synthetic locations, interior instances, spatial identifiers | Official coordinate conventions, map or navmesh APIs |
| Resource streaming and archive formats | Resource descriptors and abstract lifecycle contracts        | GTA VI archive loaders, downloadable game assets     |
| Vehicle and entity formats             | Vehicle ownership, garage records, transient entity IDs      | Network spawning, physics and vehicle native calls   |
| Animation and character data formats   | Identity, character progression, abstract appearance traits  | Character model/animation hooks                      |
| Console compatibility research         | Versioned runtime capability manifest                        | Usable PC runtime, authorized multiplayer transport  |
| Community FiveM/ESX/QBCore patterns    | Server authority, jobs, inventory, banking, permissions      | FiveM native/API compatibility with GTA VI           |

No GTA VI game files, extracted models, maps, textures, scripts, executables, decryption keys, console binaries or downloadable leaks belong in the codebase or the website.

## Evidence gates

1. Prefer first-party Rockstar/Cfx publications for platform compatibility, permissions and supported APIs.
2. Record upstream revision, observation date, precise claim, test methodology and limitations for third-party research.
3. Never promote a community hypothesis into a GTA VI runtime requirement without independently reproduced evidence and a legitimate integration path.
4. Keep `adapters/gta6` reserved. Continue building the original game-agnostic domain and its deterministic simulator.
5. Preserve data provenance and exclude proprietary resources from commits, tests, logs, example fixtures and CI artifacts.
6. Record relevant licensing and security risks before adopting external implementations.

Policy: https://www.rockstargames.com/es/community-resources/mod-guidelines

See [research protocol](./RESEARCH_PROTOCOL.md), [platform status](./PLATFORM_STATUS.md), [server blueprint](../server/SERVER_BLUEPRINT.md), and [runtime requirements](../server/RUNTIME_REQUIREMENTS.md).

## Revision pinning

The [24 November 2026 upstream tool snapshot](./THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md) records exact GitHub commits for four live research tools and their stated limitations. In particular, SixNG's current README claims BCPack decoding support where earlier summaries described more substantial gaps. This is an upstream observation, not proof of runtime access or legal permission.

**Addendum, 25 November 2026:** the canonical engine-knowledge catalog is now [GTA6_CAPABILITY_MATRIX_2026-11-25.md](./GTA6_CAPABILITY_MATRIX_2026-11-25.md) with an [uncertainty register](./UNCERTAINTY_REGISTER_2026-11-25.md); see also the 25-Nov tool-snapshot addendum below for the TOC-decryptor tool class and the Leonida takedown cause.
