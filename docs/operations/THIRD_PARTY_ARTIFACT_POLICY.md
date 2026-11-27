# Third-party artifacts and research workspaces

**State:** ACTIVE  
**Reviewed:** 2026-11-27

The project repository stores only our source, synthetic fixtures, approved dependencies and written research. An external tool's ability to extract or translate game files does not confer permission to redistribute those files or integrate them into our RP framework.

## GTA VI game files and leak/torrent material

CALM contributors and automation must not acquire for CALM, request, upload, commit, execute, unpack, decrypt, scan, disassemble, convert or otherwise process leaked or unauthorized GTA VI game files. This includes executables, archives, assets, source, extracted tables, function signatures, offsets, generated code and converted artifacts. Do not use such material to create CALM mods, admin menus or compatibility shims.

Do not link torrent or file-sharing locations in issues, pull requests, documentation or research notes. If a contributor sends game data to the project, do not inspect or redistribute it; isolate the submission from the repository and refer it to the maintainers for appropriate handling.

CALM may document behavior observed in official public materials and lawful play of a retail game at a system-design level. These observations can inform CALM-owned GTA VI RP requirements, but must not be used to claim knowledge of proprietary function names, formats, algorithms or multiplayer interfaces. CALM tooling and CI must not read a local game installation. Use synthetic fixtures to implement and test CALM behavior.

Admin interfaces and moderation tools may be built for CALM's own authenticated services and simulator. Connecting them to GTA VI requires a separately verified, authorized runtime contract.

## Separation rules

- **Repository:** project-owned code, written analysis, source links, synthetic fixtures and test data only.
- **External research workspace:** any separately acquired third-party tool stays outside the monorepo. Evaluate its license and provenance before running it. Do not point automated repository jobs or CI at game installations.
- **Proprietary game files:** never commit the game's package, executable, archives, shaders, textures, models, audio, map or navigation exports, or logs that reproduce them. This includes derived or converted artifacts.
- **Metadata:** do not assume derived file names, coordinates, hashes, inventories or manifests are safe for publication simply because they are JSON, CSV or text. Review them for provenance and redistribution rights.
- **Planning data:** original or synthetic labels, scenarios and maps are allowed. A future dataset linked to the real game requires separate rights, source and security review.

## Allowed working pattern

1. Record an external project's public URL, exact revision, license and the narrow claim being evaluated.
2. Document whether each observation is upstream-reported, independently verified or an internal inference.
3. Develop any prototype against a **synthetic fixture** with no real GTA VI assets, identifiers or coordinates.
4. Keep the RP domain and simulator free of runtime-specific calls and asset references.
5. Propose any new integration as a separate change with provenance, security, policy/license and ADR review.
6. Keep all `RT-*` requirements `UNKNOWN` unless first-party GTA VI evidence explicitly satisfies them.

## Dependency lifecycle scripts

The repository uses pnpm 10's explicit `ignoredBuiltDependencies` policy for `esbuild`. Its
install-time script remains blocked: the frozen lockfile includes the platform binary packages
for the supported Windows x64 developer environment and Ubuntu x64 CI runner, and the full local
test/build gates pass without executing the script. Revisit this decision if the supported
platforms change or the locked package stops supplying the required binary; approve only the
specific dependency after reviewing its script and provenance.

Detailed inventories of external tools and compatibility projects are maintained in a separate documentary repository. This policy is CALM's rule for repository inputs: no game files, leaked artifacts, executable samples or third-party implementation code are accepted as product dependencies.

## Automated guard and limitations

The repository hygiene guard inspects **indexed paths and non-ignored untracked paths**. It rejects known executable, installer, archive and game-export extensions, including `.exe`, `.msi`, `.msix`, `.appx`, `.apk`, `.rpf`, `.rpf9`, `.ttpf`, `.awc`, `.xvc`, `.xvd`, `.xci`, `.xip`, common RAGE asset exports, generic opaque archives and `.torrent` files, as well as suspicious game-dump names. The `.gitignore` also discourages accidental staging of these formats.

This check is **not** a binary classifier, content scanner, legal clearance or exfiltration prevention system. It does not scan ignored files, inspect archive contents, or identify proprietary data placed in allowed formats such as `.json`, `.txt`, source code, images and test fixtures. Human review remains required; avoid attaching data-containing logs/screenshots to issues or pull requests.

## No runtime decision implied

Third-party reverse engineering may inform which questions to research, but it does not satisfy the authorized GTA VI community-server requirement (`RT-001`) or establish scripting, networking, identity, anti-cheat, hosting or modding contracts.
