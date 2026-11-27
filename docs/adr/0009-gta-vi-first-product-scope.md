# ADR 0009 — GTA VI-first RP product with evidence-bounded integration

- **Status:** Accepted by the repository owner, 2026-11-27
- **Date:** 2026-11-27
- **Supersedes:** ADR-0007's product positioning and ADR-0001's goal of a reusable game-agnostic framework. Their engineering safeguards remain in force where compatible with this decision.
- **Related:** [GTA VI RP mechanics](../research/GTA6_RP_MECHANICS_2026-11-25.md), [public implementation observations](../research/GTA6_INTERNAL_SYSTEMS_2026-11-27.md), [platform status](../research/PLATFORM_STATUS.md), [runtime requirements](../server/RUNTIME_REQUIREMENTS.md), [legal and interoperability review](../legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md)

## Context

The repository owner clarified that CALM exists to prepare a roleplay product for **GTA VI specifically**. A generic RP framework, an ESX/QBCore/Qbox-compatible system, or a GTA V/FiveM architecture is not the product objective.

The game is released, but the reviewed first-party material describes it as a single-player experience and lists PlayStation 5 and Xbox Series X|S. That establishes neither a PC edition nor an authorized multiplayer/community-server runtime. Public observations of the released campaign can inform CALM's GTA VI-specific roleplay model; they cannot supply a multiplayer contract or disclose the proprietary implementation behind a mechanic.

The existing architecture correctly prevents invented natives and unsupported integration claims, but its repeated "game-independent framework" positioning makes engine-neutrality look like the product goal. For CALM, simulation and separation of concerns are engineering methods for building and testing a GTA VI-targeted product, not a commitment to serve arbitrary games.

## Decision

1. **Product target:** CALM is a GTA VI-first roleplay project. Requirements and domain models are shaped around CALM's intended GTA VI roleplay experience and behavior that can be verified through first-party statements or lawful observation of the released game.
2. **No GTA V framework blueprint:** ESX, QBCore, Qbox, FiveM and RedM are not CALM's product class, architecture template, API target or compatibility goal. CALM defines its own workflows and contracts for its GTA VI use case.
3. **Three explicit layers:**
   - **GTA VI behavior and RP specification:** evidence, confidence, version/date, CALM design consequences and unresolved questions.
   - **CALM RP domains:** original, server-authoritative rules and persisted state that express the chosen GTA VI roleplay design. They may be developed against synthetic fixtures and the simulator before a game runtime exists.
   - **GTA VI runtime integration:** client/server, entity, network, input, UI, asset and executable bindings. These remain **BLOCKED** until a documented, authorized GTA VI interface and compatible runtime are verified.
4. **Simulation is a verification tool:** the simulator demonstrates CALM domain behavior. Passing simulator tests does not prove game-file, executable, API or runtime compatibility.
5. **Mechanics are not internals:** retail-game behavior and public developer statements may support a CALM system model. They do not establish function names, signatures, offsets, schemas, algorithms or internal call graphs. Leaked executables, source, assets, dumps and derived artifacts are not implementation inputs or CALM contracts. Public repositories may be reviewed for their own high-level architecture and current status, not mined to reproduce proprietary game internals.
6. **F2 inventory scope:** persistent inventory is a CALM-owned GTA VI RP domain, informed by documented/observed distinctions such as what a character carries and what is stored in a vehicle or property. Ownership and physical location stay distinct. Equipment/loadout behavior is a separate concern and must not be represented as implemented by the current container service. Item IDs, storage limits and game object mappings remain CALM data unless first-party material explicitly defines an authorized interface.
7. **Evidence and compatibility claims:** every GTA VI-specific claim records source, date, evidence class and confidence. No feature or release may claim "GTA VI compatible" until it passes conformance tests against an authorized, documented runtime.

## Consequences

- Product documents and issue templates use GTA VI-first language and distinguish target-specific domain design from actual runtime integration.
- F2 may proceed as GTA VI-targeted roleplay inventory work; its PostgreSQL schema and simulator remain CALM implementations, not GTA VI file formats or engine APIs.
- The current game/runtime adapter remains **BLOCKED**. This ADR does not promote any `RT-*` requirement, grant permission or promise support for a future platform.
- Generic third-party resource manifests, marketplaces and ESX/QBCore compatibility remain out of scope unless a concrete CALM requirement and authorized GTA VI runtime make them necessary.
- Preserve the modular-monolith, server-authority, provenance, licensing, security and additive-migration safeguards from earlier ADRs.

## Revisit when

- Rockstar publishes a GTA VI-specific, authorized community-server or creator runtime contract; then review its exact scope, platform, license, security model and compatibility requirements before changing the blocked adapter status.
- Retail-game behavior or CALM community requirements materially change the target RP model; update the evidence record and affected domain ADRs rather than inferring proprietary internals.
