# GTA VI RP strategy — synthesis and posture for CALM Essentials

**Compiled:** 25 November 2026
**Document class:** strategy synthesis. This file consolidates planning guidance derived from the launch-state evidence and the press-observed mechanics. It does not introduce new first-party claims; every factual assertion links to the canonical evidence record ([`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md), [`GTA6_RP_MECHANICS_2026-11-25.md`](./GTA6_RP_MECHANICS_2026-11-25.md), [`UNCERTAINTY_REGISTER_2026-11-25.md`](./UNCERTAINTY_REGISTER_2026-11-25.md)).
**Decision rule:** expectation is not announcement. Nothing here promotes any `RT-*` runtime requirement or unblocks the GTA VI adapter.

## 1. Three environments, never conflated

A recurring failure mode in public discussion is treating "GTA VI", "a future GTA VI Online" and "possible GTA VI roleplay servers" as one product with shared rules. CALM keeps them separate:

| Environment                                | What is publicly established (see [`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md))                                                                                   | Consequence for CALM Essentials                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| GTA VI (shipped campaign)                  | Available since 19 November 2026 on PS5 and Xbox Series X\|S as a single-player product; no first-party PC date                                                   | A source of **mechanics observations only** — no interfaces                                      |
| GTA VI Online (hypothetical)               | No online mode, characteristics or timetable announced for GTA VI                                                                                                 | Unknown; design must not depend on it                                                            |
| Rockstar RP policy and current Cfx runtime | Rockstar says RP servers are allowed through its Creator Platform under policy; the current FXServer `gamename` documentation lists `gta5` and `rdr3`, not GTA VI | This does not establish GTA VI eligibility or a stats/runtime API; the adapter stays **BLOCKED** |

## 2. Reasonable expectations versus confirmed capabilities

The GTA Online precedent lets a project anticipate _needs_ (shared world, character creation, economy, progression) without confirming how — or whether — Rockstar will satisfy them for GTA VI. Every row below is `UNKNOWN` for GTA VI specifically:

| Anticipated need                                   | Reasonable expectation | Confirmed for GTA VI? |
| -------------------------------------------------- | ---------------------: | --------------------: |
| Multiple players sharing the world                 |                   High |                    No |
| Multiplayer character creation                     |                   High |                    No |
| Online economy and progression                     |                   High |                    No |
| Persistent properties and vehicles                 |              Plausible |                    No |
| Cooperative activities and groups                  |       High / plausible |                    No |
| Voice chat                                         |              Plausible |                    No |
| Integration of the new police-identification stack |                Unknown |                    No |
| Third-party administered servers                   |                Unknown |                    No |
| Community-programmable resources                   |                Unknown |                    No |

Planning consequence: CALM defines GTA VI-targeted RP rules for the parts expressible as CALM-owned state (identity, item custody, economy, jobs, permissions). The simulator verifies those rules; it is not a generic-game product or a substitute for the still-unknown GTA VI runtime.

## 3. The three integration scenarios and the posture

| Scenario | Description                                                                              | CALM posture                                                                        |
| -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **A**    | Rockstar ships official online sessions only; no external scripts                        | CALM remains a GTA VI-targeted simulator/design project; no integration path exists |
| **B**    | Rockstar or Cfx.re publishes an authorized creator platform for GTA VI resources/scripts | **The scenario CALM prepares for technically** — an adapter study                   |
| **C**    | Rockstar authorizes specific RP projects under individual agreements                     | Integration only with a verifiable license and technical conditions                 |

CALM records the requirements that scenario B would impose without assuming an adapter can be built. If an authorized runtime is documented, CALM must review its actual contracts and adjust the target-specific model where evidence requires it. Rockstar's RP policy describes RP servers through its Creator Platform, subject to policy; the reviewed agreement and Cfx game list do not confirm GTA VI support or an authorized GTA VI server path. [Rockstar RP policy](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers) · [Creator Platform License Agreement](https://fivem.net/terms/) · [Cfx supported games](https://docs.fivem.net/docs/server-manual/server-commands/).

## 4. Three-layer integration model

The architecture separates what the game owns from what the framework owns:

| Layer                    | Responsibility                                                                                              | CALM rule                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **GTA VI**               | World, physics, vehicles, animation, characters, game mechanics                                             | Used only through **verified interfaces**; never assumed                    |
| **CALM Runtime Adapter** | Translates available game capabilities into CALM-owned contracts (spawn/despawn representations, events)    | Every capability starts **disabled** until documented, permitted and tested |
| **CALM Essentials**      | GTA VI-targeted RP rules: identity, money, carried/stored items, property, jobs, organizations, permissions | CALM-owned and simulator-verified; not yet connected to GTA VI              |

Illustrative interface shape for one entity (a design proposal, not game code):

```ts
interface VehicleRecord {
  id: string;
  modelId: string;
  ownerId: string;
  registration: string;
  storageId: string;
}

interface VehicleRuntimePort {
  isAvailable(): boolean;
  spawn(vehicle: VehicleRecord, locationId: string): Promise<string>;
  despawn(runtimeEntityId: string): Promise<void>;
}
```

The database keeps ownership and contents; the adapter only creates or removes the transient in-world representation **when the execution platform allows it**. The same separation applies to characters, properties, items and businesses.

### Capability registry (post-F1 design item)

```ts
type GameCapability =
  | 'player.session'
  | 'entity.spawn'
  | 'vehicle.control'
  | 'world.interaction'
  | 'character.appearance'
  | 'ui.render'
  | 'voice.spatial'
  | 'weather.read';

interface GameAdapter {
  supports(capability: GameCapability): boolean;
}
```

In the simulator, fictitious capabilities are implemented so scenarios can be exercised end-to-end. In a future GTA VI adapter, **each capability begins disabled** and is enabled only with documentation, permission and conformance tests. There is an additional technical reason for this conservatism: the FiveM transition from GTA V Legacy to GTA V **Enhanced** changed synchronization, player identifiers and resource formats; cross-engine and cross-version compatibility must never be assumed.

## 5. Leonida's regions and module design

The official map identifies six regions (Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, Mount Kalaga). CALM is therefore not designed as an exclusively urban framework. The following are **CALM design proposals inspired by the environments** — none are announced online systems:

| Region        | RP functional emphasis CALM could offer               |
| ------------- | ----------------------------------------------------- |
| Vice City     | Businesses, taxis, urban police, commerce, housing    |
| Leonida Keys  | Tourism, boats, transport, coastal trades             |
| Grassrivers   | Rural jobs, rescue, wildlife-linked activities        |
| Port Gellhorn | Transport, warehouses, workshops, logistics           |
| Ambrosia      | Industry, production, regional commerce and jobs      |
| Mount Kalaga  | Rural tourism, outdoor activities, emergency services |

The existing synthetic [spatial catalog](../server/WORLD_SPATIAL_READINESS.md) already provides location-independent modeling; it grows toward owners, interaction permissions and entity relationships while data stays synthetic until legitimate access to the game world exists.

## 6. What CALM builds now versus what needs GTA VI

| System                  | Buildable now?                         | Needs GTA VI for                          |
| ----------------------- | -------------------------------------- | ----------------------------------------- |
| Accounts and characters | **Yes — delivered in F1**              | Association with real game sessions       |
| Economy and banking     | **Yes — delivered in F1**              | Optional presentation interfaces          |
| Inventories             | Yes (reference now; persistence in F2) | Item use and world representation         |
| Jobs                    | Yes (F3)                               | World interactions and actions            |
| Businesses              | Yes                                    | Premises and game entities                |
| Vehicles                | **Partially** (records, ownership)     | Spawning and control of game vehicles     |
| Housing                 | **Partially** (ownership records)      | Interiors, doors, interactions            |
| Police RP               | Yes — records and case files           | Optional: world events and game entities  |
| Phone RP                | Yes — services and data                | Integrated UI if one is supported         |
| Weather and physics     | **Not to be reimplemented**            | Use game-provided capabilities if exposed |

The practical conclusion: CALM can specify and test its **GTA VI RP domain behavior** before a multiplayer runtime exists. F1 proves that durable identity and economy services work in CALM; it does not make them a generic framework or establish game integration. Target mechanics research must drive the next domain decisions while runtime bindings remain gated.

## 7. Research lines from here

1. **Game-system research — primary line** — document campaign behavior and named developers' public explanations of missions, AI, vehicles, animation and world systems. Keep observations separate from assumptions about internal source code; see [`GTA6_RP_MECHANICS_2026-11-25.md`](./GTA6_RP_MECHANICS_2026-11-25.md) and [`GTA6_INTERNAL_SYSTEMS_2026-11-27.md`](./GTA6_INTERNAL_SYSTEMS_2026-11-27.md).
2. **Integration research — later gate** — monitor Rockstar announcements of an authorized GTA VI external-resource environment: permitted languages, player/entity management, event mechanisms and legal conditions. This is necessary before game-facing integration, but it does not delay evidence-based design of CALM's GTA VI roleplay systems.

## 8. Recommendation (project decision)

- Do **not** build a police system that tries to replicate GTA VI's internal AI, or an inventory that assumes knowledge of the game's weapon identifiers.
- Do **build first** the CALM domains that express the chosen GTA VI RP experience: identity, money, carried/stored items, vehicles, jobs, organizations and permissions, with source-linked requirements and simulator coverage.
- Keep game-facing contracts and any executable adapter **blocked** until the authorized GTA VI runtime and its documented capabilities are verified.

The near-term research question is **how the released game's observable systems and Rockstar's public developer explanations can inform CALM's original RP domain design without pretending to know the proprietary source code**. Any future online/creator-service announcement will answer a separate integration question: which documented capabilities CALM may use under the applicable authorization.
