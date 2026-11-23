# Third-party artifacts and research workspaces

**State:** ACTIVE  
**Reviewed:** 2026-11-23

The private server repository stores only our source, synthetic fixtures, approved dependencies and written research. An external tool's ability to extract or translate game files does not confer permission to redistribute those files or integrate them into our RP platform.

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

For Leonida-specific analysis, see [the dated assessment](../research/LEONIDA_2026-11-23.md).

## Automated guard and limitations

The repository hygiene test inspects **Git-tracked paths** and rejects known game package/export extensions (`.rpf`, `.ttpf`, `.awc`, `.xvc`, `.xex`) and `game_scarlett_master.exe`. The `.gitignore` discourages accidental staging of these formats.

This check is **not** a binary classifier, content scanner, legal clearance or exfiltration prevention system. Proprietary data can also appear in `.json`, `.txt`, source code, images and test fixtures. Human review remains required; avoid attaching data-containing logs/screenshots to issues or pull requests.

## No runtime decision implied

Third-party reverse engineering may inform which questions to research, but it does not satisfy the authorized GTA VI community-server requirement (`RT-001`) or establish scripting, networking, identity, anti-cheat, hosting or modding contracts.
