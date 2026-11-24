# Public RAGE 9 tool repositories — revision-pinned snapshot

**Checked:** 24 November 2026 through GitHub repository metadata and public upstream README files.

**Evidence tier:** third-party tool source and its own claimed results, not first-party Rockstar confirmation. A Git commit SHA establishes a reviewed _tool version_, not the authenticity of any GTA VI game dump, access permission, complete file format, playable game runtime or multiplayer native API.

| Public project                                              | Reviewed head SHA                                                                                          | What the upstream README actually describes                                                                                                     | Known boundary                                                                                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [rage9-re](https://github.com/Ahmet-Dedeler/rage9-re)       | [30c6d2150ad9](https://github.com/Ahmet-Dedeler/rage9-re/commit/30c6d2150ad9d3021802f509ff3ee232d466f499)  | Rust/Python read-only inspection of RPF9 script-data and animation formats; parses PSIN/PSO structures and exports selected animations as glTF  | Self-reported format parsing; **not callable scripts or GTA VI natives**; reported skeleton/quantization gaps                                                          |
| [SixNG](https://github.com/holdmysocks/SixNG)               | [03c814c11736](https://github.com/holdmysocks/SixNG/commit/03c814c11736a0818a3c4d8f2e3591d5a28a47fa)       | Rust archive and asset extractor; zlib carving index, texture/model preview; upstream now claims BC1/BC3/BC4/BC5/BC6H/BC7 BCPack decode support | Native archive TOC remains unreadable by the tool; some codec blocks are imperfect, with documented fallbacks; **GPL-3.0**, do not copy its source into an MIT package |
| [rpf9-explorer](https://github.com/breadbbbb/rpf9-explorer) | [cab9bb6ebe6d](https://github.com/breadbbbb/rpf9-explorer/commit/cab9bb6ebe6d46fec6ac90ee5004bdd8cfd9e31a) | Cross-platform archive viewer, index/recovery scanning, asset previews and local exports; indexed mode depends on a compatible local decoder    | Archive rebuilding unavailable; does not distribute game source or executable; inspect its license independently before any reuse                                      |
| [Xbox2Windows](https://github.com/R0Y00/Xbox2Windows)       | [bc43e6659ea2](https://github.com/R0Y00/Xbox2Windows/commit/bc43e6659ea2971a6cd82bc4baecd685e13f251c)      | Xbox-to-Windows recompilation research, synthetic GPU checks and limited modified diagnostic executable results                                 | Its README explicitly says original executable startup, menu navigation and gameplay remain unverified; **not a server**                                               |

## Repository availability caveat

At this check, the GitHub repository metadata endpoint returned 404 for the historical URL https://github.com/ItsNotRexed/Leonida . Search-engine results and forks may retain stale copies or show similarly named projects; do not present them as a verified currently accessible original. Recheck the exact upstream repository before citing or adopting any specific implementation.

## What we can safely derive

- Original project-owned resource descriptors: type, version, provenance, license, optional checksum for our _own_ data, availability and dependency states.
- Original world/space abstractions for a **synthetic** simulator, without coordinates, assets, models or maps extracted from GTA VI.
- A separate future game-runtime adapter with explicit capability verification. Archive readers are offline developer tooling and must never be treated as engine execution interfaces.
- A strict import policy: no RPF files, decompiled executables, console packages, private symbols, leaked assets, extracted game scripts or third-party code without a license and provenance review.

## What these projects do not establish

They do **not** establish a GTA VI mod SDK, a scripting language exposed by Rockstar, multiplayer event hooks, authoritative entity creation, a dedicated server, client authentication interfaces, resource download permissions, backwards compatibility with FiveM or permission to bypass Rockstar's policies.

**Decision:** continue with original core and simulator modules. All GTA VI runtime capabilities stay UNKNOWN until first-party authorization, runnable public interfaces and reproducible conformance evidence exist. See [runtime requirements](../server/RUNTIME_REQUIREMENTS.md) and [first-party evidence](./FIRST_PARTY_EVIDENCE_2026-11-24.md).
