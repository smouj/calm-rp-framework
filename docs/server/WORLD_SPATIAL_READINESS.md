# CALM spatial planning: synthetic world readiness

**State:** DRAFT — independent of GTA VI runtime  
**Reviewed:** 2026-11-23

## Product boundary

This catalog contains project-authored planning locations only. Its IDs, coordinate spaces, geometry and labels are synthetic; they are not derived from GTA VI files, extracted maps or third-party compatibility projects. Detailed external file-format research is maintained outside CALM and does not define this model.

## Our independently implemented abstraction

`packages/core/src/world-planning.ts` provides a validated, read-only catalog for project-authored planning locations. It is used for synthetic prototyping, not world ingestion.

- **Stable project IDs:** independent of model names, hashes and runtime entity handles so property, business and service identities survive platform changes.
- **Coordinate spaces:** a separate `spaceId` even for conceptual instanced interiors; no assumed transformation into GTA VI coordinates.
- **3D placement:** finite position, ordered optional bounds and point containment for independently authored drafts.
- **Hierarchy:** parent links, forward references and cycle rejection, including parent-child relationships across spaces.
- **RP classifications:** exterior/interior/underground and region/business/property/service/transport/interaction.
- **Review status:** filter `draft` or `reviewed` planning records; no game capability is implied.
- **Provenance:** accept only `synthetic` or `project-owned` records; reject external-provenance records.
- **Spatial search:** deterministic point lookup and anchor proximity in one space, never routing or travel time.

The catalog is **not** an authority or permissions engine: `reviewed` is only editorial planning state, not a guarantee of staff approval or live deployment. Any future mutations will go through explicit authenticated/authorized application commands and auditable storage.

## Synthetic demonstration

`adapters/simulator/src/world-planning.ts` creates a fictional district, a medical building, a separate-space lobby and a business draft. Its labels and coordinates are original fixtures unrelated to GTA VI locations, file names or map coordinates.

The simulator may query proposed RP service locations, inspect spatial containment and rehearse internal planning. It must never spawn game entities or claim access to Rockstar files.

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
