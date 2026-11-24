# GTA VI technical research snapshot — 24 November 2026

**Evidence class:** publicly observable third-party projects and media reports; NOT an official GTA VI scripting API or a verified multiplayer runtime.

## Leak claim versus GitHub source repositories

CyberLeek has claimed distribution of approximately 209 GB of Xbox GTA VI game-build data and, later, an executable. Neither authenticity, integrity, redistribution rights nor the claimed completeness are independently confirmed by this project. Public GitHub repositories inspected by the community principally host research code, format notes, and tools; do not claim GitHub hosts the full 209 GB build. Hashes alone cannot establish publisher authenticity. A decompiler/recompiler project is not equivalent to the original Rockstar source code.

Selected public documentation/tool repositories (not vetted, no endorsement):
- https://github.com/ItsNotRexed/Leonida — recompilation and format research.
- https://github.com/holdmysocks/SixNG — game asset format/tooling observations.
- https://github.com/breadbbbb/rpf9-explorer — RPF9 research tools.
- https://github.com/nullbrik/RageForge — RAGE archive and world research.
- https://github.com/R0Y00/Xbox2Windows — console compatibility experimentation.
- https://github.com/Ahmet-Dedeler/awesome-gta6-reverse-engineering — curated community index.

**These sources make claims about their own implementations.** No compatibility or legal authorization should be inferred from their existence. Do not copy GPL/copyleft sources into the MIT project without compatibility and licensing review.

## Implications for the independent RP core

| Observation/research topic | Portable abstraction we can build | Runtime-dependent assumption still blocked |
| --- | --- | --- |
| World coordinate spaces and interiors | Synthetic locations, interior instances, spatial identifiers | Official coordinate conventions, map or navmesh APIs |
| Resource streaming and archive formats | Resource descriptors and abstract lifecycle contracts | GTA VI archive loaders, downloadable game assets |
| Vehicle and entity formats | Vehicle ownership, garage records, transient entity IDs | Network spawning, physics and vehicle native calls |
| Animation and character data formats | Identity, character progression, abstract appearance traits | Character model/animation hooks |
| Console compatibility research | Versioned runtime capability manifest | Usable PC runtime, authorized multiplayer transport |
| Community FiveM/ESX/QBCore patterns | Server authority, jobs, inventory, banking, permissions | FiveM native/API compatibility with GTA VI |

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
