# GTA VI RP mechanics — press observations and CALM design consequences

**Compiled:** 25 November 2026
**Updated:** 27 November 2026 — official support documentation, character pages and post-launch gameplay guides reviewed
**Evidence class:** third-party press observation of **game behavior**, not documentation of programming interfaces. Observing a mechanic does not disclose the engine function that runs it, and none of this is an authorization.
**Sources re-opened 2026-11-27:** Rockstar's official character pages, GTA VI accessibility/settings help and launch patch notes; post-launch hands-on guides/reviews from Push Square, Tom's Guide and GamesRadar; Digital Spy review (200 hours played), GamesRadar coverage of the Rockstar North co-studio head interview (September 2026) and other player guides; official Rockstar accessibility/control documentation; declared Rockstar technology-staff statements about open activities.

These observations influence **how CALM Essentials models data**. They never supply assumed APIs, native names, addresses or signatures, and the resulting limits are **configurable defaults, never hard requirements** for every server.

## Observed mechanics and design decisions

| GTA VI system                                      | Evidence available                                                                                        | Decision for CALM Essentials                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Weapons with limited carrying capacity             | Press/interview coverage: two long guns visible on the character; stricter carry limits than GTA V        | Inventory with **carried items and separate storage/equipment**; configurable limits |
| Trunks holding weapons, items and clothes          | Reviews: retrieving outfits from the car trunk can help lose the cops; getaway outfits stored per vehicle | **Containers associated with vehicles**                                              |
| Appearance changes to defeat police identification | Reviews: dipping into a clothing store or changing outfits evades identification                          | **Persistent appearance** and police records modeled independently                   |
| Identification by vehicle, clothing and cameras    | Review coverage of identification mechanics                                                               | Incidents, suspects, evidence and related vehicles as **linked records**             |
| Vehicles with fuel                                 | Launch-review coverage                                                                                    | Fuel state as **optional, configurable** vehicle state                               |
| Phone, contacts and banking operations             | Launch-review coverage                                                                                    | Phone and banking as **decoupled services**                                          |
| Fishing and hunting                                | Official Rockstar accessibility documentation of controls                                                 | Optional **activities/skills** in the domain model                                   |
| Nitrous in vehicles                                | Official control documentation                                                                            | **Capability/upgrade model** for vehicles                                            |
| More open activities and missions                  | Declared statements of a Rockstar technology lead (David Hynd)                                            | **Objective-based configurable jobs**, not exclusively rigid sequences               |

Three of these decisions shape the domain model materially:

### A — Inventory beyond the classic ESX list

Objects are not just a per-player list. The system distinguishes **carried items, active equipment, vehicle containers, warehouses and properties**. Ownership is independent of physical location: a weapon can belong to a character while being stored in a vehicle. Observed campaign limits (weapons or clothing) become **per-server configurable defaults**.

### B — Vehicles as persistent entities

A vehicle has its own identity, owner, access permissions, inventories and optional states (fuel, damage, upgrades). The database record is distinct from any transient in-game representation, so an adapter recreating an entity does not lose owner or contents. We do not assume single-player fuel, damage or customization functions will exist in a future multiplayer environment.

### C — Police built on records and incidents

Rather than a flat list of offenses, CALM records an **incident** with participants, evidence, associated vehicles, reports and investigation outcomes. Automatic identification by cameras or appearance is an **optional integration capability**, never a requirement for the police module to function.

## Boundary with the capability matrix

Game-behavior observations complement the [capability matrix](./GTA6_CAPABILITY_MATRIX_2026-11-25.md): the matrix records what public research has demonstrated about the engine's formats and systems; this file records how reviewers describe gameplay. Neither class of evidence provides a callable GTA VI interface, and no `RT-*` requirement is promoted by either.

## Character stats: published evidence and unknowns

The official Rockstar bios describe Jason's Army background and Lucia's history of fighting and imprisonment. Those are **story biographies**, not a reusable player-stat sheet; they do not establish starting values, skill bonuses or an RP progression formula. [Only in Leonida — official character bios](https://www.rockstargames.com/VI/only-in-leonida).

Rockstar Support confirms visible categories and interactions: the UI has a **Player & Vehicle Status** settings category; accessibility options can alter enemy health/damage and vehicle health, simplify exercise interactions and adjust visual effects associated with low health; official launch notes mention the gym deadlift interaction, wanted-level behavior, weather, phone calls and partner handoffs of bags to fences. These official sources confirm campaign systems exist, but do not publish their underlying data schema, exact progression formulas or multiplayer exposure. [Settings categories](https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings) · [Accessibility features](https://support.rockstargames.com/articles/5g5CmDTne3WcpK7nsWsMR8/grand-theft-auto-vi-accessibility-features) · [Launch updates, 23 November](https://support.rockstargames.com/articles/sN5pEdFYZdlvijKXd6xpJ/grand-theft-auto-vi-launch-updates-ps5-xbox-series-x-or-s?pubDate=20261123).

Post-launch guides/reviews based on playing the released campaign report three visible meters: **Strength** (health/damage tolerance and melee power), **Cardio** (stamina for sustained activity), and **Focus** (duration of combat Focus Mode). A guide reports that the Fitness phone app also tracks hunger, those meters, muscle/body-fat composition and Strength/Cardio workout windows; it says Strength/Cardio may regress when a workout window is missed, while Focus does not. Treat these as independently published gameplay observations, not a Rockstar API or a complete stat inventory. [Push Square workout guide](https://www.pushsquare.com/guides/gta-6-workouts-explained-and-why-to-do-them) · [Tom's Guide hands-on review](https://www.tomsguide.com/gaming/gta-6-review) · [GamesRadar workout guide](https://www.gamesradar.com/games/grand-theft-auto/gta-6-workout/).

GamesRadar's post-launch coverage also reports Focus gains from concentration activities such as minigolf, shooting-range challenges, meditation and fishing. This gives CALM an activity-design reference (activities can contribute to a competency) without establishing an exact award amount, exhaustive activity list or online behavior. [GamesRadar, 120-hour review](https://www.gamesradar.com/games/grand-theft-auto/120-hours-in-gta-6-whats-it-really-like-to-review-the-biggest-entertainment-event-of-the-decade/).

| Candidate system                                                                    | Evidence status                                                                                                                                                                                                                              | CALM treatment                                                                                                                             |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Strength, Cardio and Focus                                                          | Independent post-launch guides/reviews report visible campaign meters and qualitative effects; Rockstar support confirms status UI categories but publishes no stat specification                                                            | Useful observation for an optional CALM model; do not copy numeric scales/formulas or claim a GTA VI runtime mapping.                      |
| Exercise / gym / workout windows                                                    | Official support and patch notes confirm exercise interactions and a gym deadlift action; Push Square and GamesRadar guides report Strength/Cardio gains, recovery windows and, in Push Square's account, regression when a window is missed | Model optional server activities and rules only if desired; the guides do not define multiplayer persistence or authoritative award logic. |
| Focus-building activities                                                           | GamesRadar's review coverage reports gains through concentration activities such as minigolf, shooting range, meditation and fishing                                                                                                         | CALM can support configurable activity-to-progression rules; do not hard-code these as GTA VI server events.                               |
| Health / injury                                                                     | Official help references low-health visual effects; hands-on guides describe Strength as influencing health and damage tolerance. No medical data schema or persistence contract is published.                                               | Keep temporary condition and medical RP records separate from identity and long-term progression; make persistence a community policy.     |
| Hunger / body composition                                                           | Push Square reports Fitness-app hunger, muscle and body-fat state; no official external data schema was found                                                                                                                                | Treat as campaign observation; if CALM wants needs/body-composition rules, define them independently and make them configurable.           |
| Vehicle condition, wanted level, weather, phone and fencing                         | Official support/patch notes confirm observable systems or fixes                                                                                                                                                                             | Useful design references for CALM vehicle, incident, environment, communications and business domains; not proof of server APIs.           |
| Thirst, stress, exact calorie/metabolism formulas and complete physiological scales | No complete official schema or formulas found in the reviewed sources                                                                                                                                                                        | Optional, server-authored rules only; do not infer that unreported needs/stats exist in the game.                                          |
| Multiplayer character stats / runtime read-write interface                          | **UNKNOWN**; the reviewed launch material does not publish a community-server contract                                                                                                                                                       | Keep all GTA VI adapter fields disabled until an authorized runtime and documented contract exist.                                         |

### Proposed CALM boundary

The current character module owns identity and lifecycle, not a GTA VI stat sheet. Keep the next design in separate concepts:

1. **Profile and identity:** name, account ownership, legal/RP metadata and lifecycle.
2. **Progression:** optional, server-defined competencies and training history, with versioned definitions, explicit ranges and auditable, idempotent changes.
3. **Condition:** short-lived health, injury or other medical state owned by the medical workflow; it is not the character's permanent identity or skill level.
4. **Needs and activities:** optional server rules such as hunger or fatigue, each independently configurable and removable.
5. **Game projection:** a future adapter may map CALM-owned state only to documented, authorized game capabilities. It must not make client-reported values authoritative.

This separation lets CALM build an original RP progression system now using clearly labeled campaign observations, without baking unverified numeric assumptions or leaked implementation details into its core.
