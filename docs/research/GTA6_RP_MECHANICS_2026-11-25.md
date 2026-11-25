# GTA VI RP mechanics — press observations and CALM design consequences

**Compiled:** 25 November 2026
**Evidence class:** third-party press observation of **game behavior**, not documentation of programming interfaces. Observing a mechanic does not disclose the engine function that runs it, and none of this is an authorization.
**Sources re-opened 2026-11-25:** Digital Spy review (200 hours played), GamesRadar coverage of the Rockstar North co-studio head interview (September 2026) and player guides; official Rockstar accessibility/control documentation for fishing, hunting and vehicle controls; declared Rockstar technology-staff statements about open activities.

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
