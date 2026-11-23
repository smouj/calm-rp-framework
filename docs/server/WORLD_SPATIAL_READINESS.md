# Spatial readiness: from world-file research to RP planning

**State:** DRAFT — independent of GTA VI runtime  
**Reviewed:** 2026-11-23

## What the external research establishes

The Leonida project documents identifiable categories of data in an Xbox Series GTA VI package: RPF9 containers, world placement metadata, model/drawable resources, navigation-mesh tiles, heightmaps and interior-related data. Its records describe technical investigation of one game version, not a developer API or stable multiplayer integration surface.

Selected upstream documentation (third-party claims; **not** first-party GTA VI runtime evidence):

- [World placement and streaming](https://github.com/ItsNotRexed/Leonida/blob/main/docs/world.md): distinct placement records, transforms, bounds and streamed map cells.
- [World census](https://github.com/ItsNotRexed/Leonida/blob/main/docs/world_census.md): a distinction between placement maps and metadata-only records.
- [Navmesh research](https://github.com/ItsNotRexed/Leonida/blob/main/docs/navmesh.md): tile-based navigation resources, sparse spatial tables and different types of nav data.
- [Model recovery](https://github.com/ItsNotRexed/Leonida/blob/main/docs/models.md): model/fragment/drawable data and incomplete decoding coverage.
- [Game data](https://github.com/ItsNotRexed/Leonida/blob/main/docs/gamedata.md): configuration data and heightmap formats.

These observations justify separating **location identity**, **coordinate spaces**, **placement/geometry**, **potential navigation** and **gameplay ownership** in our design. They do **not** justify adopting internal RAGE types or extracted assets as a server contract.

## Our independently implemented abstraction

`packages/core/src/world-planning.ts` provides a validated, read-only catalog for project-authored planning locations. It is used for synthetic prototyping, not world ingestion.

| Feature | Behavior | Why it matters for our future server |
| --- | --- | --- |
| Stable project IDs | Unrelated to model names, hashes and runtime entity handles | Property/business/EMS identities survive platform changes |
| Separate `spaceId` | Distinct coordinate spaces, including conceptual instanced interiors | Interior planning does not require a real-game world transform |
| 3D position and optional AABB | Finite coordinates, ordered bounds and point containment | Spatial drafts can be inspected without game objects |
| Parent relation | Referential integrity, forward references and cycle rejection, **including across spaces** | A lobby can belong to an exterior service building without sharing coordinates |
| Layer and RP use | Exterior/interior/underground; region/business/property/service/transport/interaction | Server workflows can attach meaning without relying on render assets |
| Draft vs reviewed | Filtering of planning records only | An idea does not silently become a published game capability |
| Provenance | Only `synthetic` or `project-owned`; third-party records rejected | Game extracts cannot enter through the typed catalog by default |
| Search | Bounded point lookup and deterministic anchor-distance query | Supports a test planner with no navmesh pathfinding claim |

The catalog is **not** an authority or permissions engine: `reviewed` is only editorial planning state, not a guarantee of staff approval or live deployment. Any future mutations will go through explicit authenticated/authorized application commands and auditable storage.

## Synthetic demonstration

`adapters/simulator/src/world-planning.ts` creates a fictional district, a medical building, a separate-space lobby and a business draft. Its labels and coordinates are original fixtures unrelated to GTA VI locations, file names or map coordinates.

The simulator may query proposed RP service locations, evaluate spatial overlaps and rehearse internal planning. It must never spawn game entities or claim access to Rockstar files.

## Later integration: bounded and separately approved

A potential future licensed importer would be a **separate adapter**, with an explicit rights/provenance review and a canonical application mapping. It would translate approved content into our project IDs and space/placement conventions. Do not implement that adapter without a legitimate GTA VI development/runtime path, its API documentation and the existing `RT-*`/ADR gates.

For future planning, maintain these distinctions:

1. **World asset** (render mesh, texture or audio) is not a durable RP property.
2. **Placement record** (transform/bounds) is not a server-authorized entity spawn.
3. **Navmesh data** is not proof of travel routing, walkability rules or network synchronization.
4. **Interior metadata** is not proof of multiplayer instance/session support.
5. **Game version** is not a stable reference key for RP accounts, characters or ownership.
6. **Offline parsing** is not evidence that GTA VI allows third-party community servers.

## Tests and guardrails

`tests/world-planning.test.ts` covers coordinate-space isolation, 3D bounds, search, status filtering, parent references, cycles, duplicates, malformed coordinates, provenance rejection and defensive copying.

This change adds **no RPF9 reader**, no proprietary game-data import, no networking assumptions, no database migration and no GTA VI adapter implementation. Our game-facing runtime remains blocked pending first-party evidence; see `docs/server/RUNTIME_REQUIREMENTS.md`.

Reference decision: [ADR-0005](../adr/0005-independent-world-planning.md).
