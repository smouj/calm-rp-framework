# ADR-0005: Independent spatial planning before game-runtime integration

- Status: Proposed for review
- Date: 2026-11-23

## Context

Our planned RP server needs stable references to businesses, properties, emergency services and locations. Third-party technical research into GTA VI world files shows that placement, model, interior and navigation information are separate concerns, while their exact game/runtime integration and legal availability remain unknown.

Importing RAGE data structures, map IDs or coordinates into our domain now would create an unverified dependency and risk carrying proprietary data into the repository.

## Decision

Introduce a **game-agnostic, project-owned world-planning catalog** in `packages/core`, with synthetic fixtures in the simulator:

- project-local IDs and coordinate-space IDs, with no inferred Rockstar semantics;
- independent exterior/interior/underground classifications and RP use;
- finite 3D points and optional validated axis-aligned bounds;
- parent-child conceptual links that can cross coordinate spaces, without transform inference;
- optional draft/reviewed planning state, without treating it as an authorization model;
- only synthetic or project-owned provenance.

The prototype is read-only and in memory. It does not import game assets, alter authoritative persistent state, authenticate users, call a game runtime, or define an entity spawn API. The architecture is additive and continues to follow ADR-0001 and ADR-0003.

## Consequences

Positive:

- We can test a realistic RP location hierarchy today, including hypothetical separate-space interiors.
- Future integrations can map authorized game content to stable RP IDs without rewriting property/EMS/business rules.
- Spatial searches are deterministic, auditable tests can be built from synthetic data, and malformed inputs fail early.

Costs:

- Coordinates and bounds are only meaningful within one explicitly declared planning space.
- Anchor proximity is not pathfinding or travel time.
- Domain-specific ownership, permissions, moderation and durable storage remain separate implementation tasks.
- Runtime-specific coordinate conversion and scene/streaming semantics cannot be chosen yet.

## Gates

Promoting this proposed design to a durable application contract requires review of domain ownership, staff authority and persistent schemas. Any GTA VI-specific importer or client adapter needs first-party runtime authorization, license/security assessment, relevant `RT-*` updates and conformance tests.

The independent spatial prototype itself does not advance P5 or change any `RT-*` requirement.
