# Uncertainty register — GTA VI integration unknowns

**State:** ACTIVE · **Reviewed:** 2026-11-25 · **Owner:** research pass (human review required before any state change)

Every entry records what we do not legitimately know, why it matters, and the concrete
event that would resolve it. This register is the negative space of the
[capability matrix](./GTA6_CAPABILITY_MATRIX_2026-11-25.md): what public research has **not**
established. It complements `docs/server/RUNTIME_REQUIREMENTS.md` (all `RT-*` UNKNOWN).

## Levels of resolution

- `R-official` — resolvable only by first-party Rockstar/Take-Two/Cfx.re publication.
- `R-evidence` — resolvable by legitimate public technical evidence (owned-data research).
- `R-time` — resolvable by waiting; no action possible.
- `R-never` — outside our control; plan must not depend on it.

## Register

| ID   | Uncertainty                                                                             | Why it matters for CALM                                                      | Class                     | Trigger that would resolve it                | Current reading (2026-11-25)                                                                 |
| ---- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| U-01 | Whether GTA VI will ever have an authorized community-server/creator runtime            | Gates P5/P6 entirely; the project's GTA VI horizon                           | R-official                | Rockstar/Cfx.re GTA VI-specific announcement | None exists; Cfx forum thread (5439461) closed with no official answer                       |
| U-02 | Whether a GTA VI multiplayer product (Online successor) will exist                      | Could replace or forbid independent RP                                       | R-official                | First-party announcement                     | Launch product documented as single-player; no online product announced                      |
| U-03 | GTA VI PC release timing                                                                | Without a PC runtime no FiveM-style ecosystem is plausible                   | R-official (rumors exist) | Official Rockstar date                       | RUMOR: "Q1 2027" per four industry sources (GamesBeat, 2026-10-13); PC Gamer estimates 2027+ |
| U-04 | Authenticity/integrity/completeness of the leaked ~209 GB Xbox build and executable     | Leaked inputs are non-admissible regardless; also untrustworthy              | R-never (for us)          | N/A — we do not rely on it                   | Media-documented event only; files never verified by this project                            |
| U-05 | Whether BCPack reaches byte-exact reconstruction                                        | Only matters to asset research; zero adapter impact                          | R-evidence                | Public codec research milestone              | Not established for any codec (GTA6-Asset-Info open problem)                                 |
| U-06 | PSO/script-data semantics (LSNS records, enums, struct names)                           | Would reveal GTA VI's internal scripting data model — still not a public API | R-evidence                | Continued rage9-re/PercyStar-class research  | Framing corroborated; semantics largely unknown                                              |
| U-07 | What scripting model a hypothetical GTA VI server would expose                          | RT-003/RT-004 remain UNKNOWN                                                 | R-official                | First-party developer docs                   | Nothing public; FiveM's Lua/JS/C# must not be assumed portable                               |
| U-08 | Identity/authentication scheme for any future GTA VI multiplayer                        | RT-005; identity durability, migration                                       | R-official                | First-party docs                             | Unknown; current Cfx identifier deprecations are GTA V-ecosystem evidence only               |
| U-09 | Synchronization/entity-ownership semantics                                              | RT-008/RT-009; adapter concurrency model                                     | R-official                | First-party docs                             | Unknown; Enhanced's client-server sync is GTA V evidence only                                |
| U-10 | Whether Creator Platform licensing will cover GTA VI                                    | RT-001 + policy/monetization boundary                                        | R-official                | Policy update naming GTA VI                  | Creator Platform policy (2026-09-15) does not name GTA VI                                    |
| U-11 | Take-Two enforcement trajectory vs RE/translation projects                              | Risk to any tooling we cite or depend on                                     | R-time                    | Each takedown/legal action                   | Active (Leonida DMCA 2026-11-24; CEO "enhancing legal activities" 2026-11-09)                |
| U-12 | Survival of key research repos (SixNG, GTA6-Asset-Info, rage9-re)                       | Research continuity; GPL docs could vanish                                   | R-time                    | Repo activity/takedowns                      | All active 2026-11-25; awesome-list serves as live index                                     |
| U-13 | Whether an unofficial "playable PC port" emerges from recomp scene                      | Temptation vector for communities; still unauthorized, unstable, unsafe      | R-time                    | Scene milestones                             | Boot-to-world at 0.5-4 fps self-reported; nothing playable; network blocked by design        |
| U-14 | Malware wave targeting GTA VI seekers                                                   | Community safety; repo must warn users                                       | R-time                    | Vendor reports                               | Bitdefender ClickFix info-stealer documented 2026-11-20; expect escalation                   |
| U-15 | Market direction of RP frameworks                                                       | Validates/pressures CALM's game-agnostic bet                                 | R-time                    | Framework events                             | QBCore org moved to Mantle (UE5) 2026-11; Qbox maintained; ESX Legacy maintained             |
| U-16 | Whether Rockstar's nopixel V / launcher-distribution model extends to other communities | Precedent for authorized RP distribution                                     | R-official                | Rockstar announcements                       | Currently GTAV-ecosystem specific                                                            |

## Standing rules

1. An uncertainty may only be closed by its trigger — never by optimism, roadmap pressure or leak-derived hints.
2. Closing any `R-official` item requires updating `PLATFORM_STATUS.md` first, then `RT-*` states, then ADRs — in that order.
3. `R-time` items get a watch entry in the tracking procedure; no reports when nothing material changes.
4. Uncertainty is not failure: the architecture is explicitly designed so that U-01 resolving to "never" still leaves CALM useful (see `ARCHITECTURE.md`, ADR-0001/0002/0006).
