# Character Progression — CALM Design Boundary

**Status:** design proposal; no progression schema or service is implemented.
**Reviewed:** 2026-11-27
**Scope:** CALM-owned roleplay progression, independent of any game runtime.

## Evidence from GTA VI

Rockstar's public material confirms visible categories and activities: the settings UI has a “Player & Vehicle Status” group; accessibility settings can adjust enemy health and damage, vehicle health, exercise interactions, and visual effects associated with low player health; launch notes also mention a gym deadlift interaction. The official character biographies give Jason and Lucia story backgrounds. These establish campaign behavior and narrative, not a player-created RP stat schema. [Settings](https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings) · [Accessibility features](https://support.rockstargames.com/articles/5g5CmDTne3WcpK7nsWsMR8/grand-theft-auto-vi-accessibility-features) · [Launch updates](https://support.rockstargames.com/articles/sN5pEdFYZdlvijKXd6xpJ/grand-theft-auto-vi-launch-updates-ps5-xbox-series-x-or-s?pubDate=20261123) · [Character biographies](https://www.rockstargames.com/VI/only-in-leonida).

Post-launch hands-on guides and reviews add qualitative gameplay observations: they describe **Strength** as affecting health/damage tolerance and melee power, **Cardio** as affecting stamina for sprinting/swimming, and **Focus** as affecting the duration of combat Focus Mode. A detailed guide reports that the Fitness app tracks hunger, these three meters, body composition (muscle/body fat), and separate Strength/Cardio workout windows. It also reports that Strength/Cardio can regress when a workout window is missed while Focus does not; treat that timing/regression behavior as a guide observation, not an official specification. [Push Square workout guide](https://www.pushsquare.com/guides/gta-6-workouts-explained-and-why-to-do-them) · [Tom's Guide hands-on review](https://www.tomsguide.com/gaming/gta-6-review) · [GamesRadar workout guide](https://www.gamesradar.com/games/grand-theft-auto/gta-6-workout/).

GamesRadar's reviewer also reports Focus gains from concentration activities including minigolf, shooting-range challenges, meditation and fishing. This supports the observation that different activity types can feed a character meter, but not an exact award formula or a complete activity list. [GamesRadar, 120-hour review](https://www.gamesradar.com/games/grand-theft-auto/120-hours-in-gta-6-whats-it-really-like-to-review-the-biggest-entertainment-event-of-the-decade/).

These are observations of the released single-player game from reviewers/guides, not source-code analysis or an API contract. They do not establish exact scales/formulas, all effects, server persistence, multiplayer behavior, or authorized third-party read/write access.

**Evidence conclusion:** Strength, Cardio, and Focus are reported as visible gameplay meters in the released campaign, with the qualitative effects above. Do not present a CALM-defined value, formula, or multiplayer mapping as native GTA VI behavior. The sources reviewed do not establish separate shooting, driving or stealth progression meters, nor the complete scale, formula or persistence of the Fitness app's hunger/body-composition state. An exercise animation alone does not reveal exact gains or storage.

## CALM model

Keep four kinds of data distinct:

1. **Character profile:** identity, ownership, lifecycle, and community-defined RP biography. It is not a skills record.
2. **Progression:** optional, community-configured competencies or qualifications. Definitions specify a stable key, version, meaning, unit, bounds, visibility, and permitted award rules. The core ships with no GTA VI-named stat list or universal numeric scale.
3. **Condition and needs:** temporary or policy-driven state such as injury or fatigue, owned by the relevant medical/needs workflow. It does not silently change permanent competency values.
4. **Game projection:** a future adapter may map a CALM field to the game only when a supported, authorized interface documents that capability. Unknown game values remain unmapped.

Communities decide whether progression exists, which definitions they use, how it changes, and whether it persists. CALM provides validation, ownership, auditability, and persistence contracts; it does not dictate a universal RPG balance system.

## Authoritative change contract

- A client can request an activity or report an observation; it cannot submit a trusted resulting stat value, award, or delta.
- A server-side rule checks character ownership, eligibility, cooldowns/limits, and the active definition version, then calculates any award.
- Each accepted change has an idempotency key and audit context (actor/source, rule, reason, timestamp, definition version). Replaying a request cannot award progression twice.
- The state update and its audit/progression event commit atomically. Bounds are checked at the persistence boundary as well as in domain logic.
- Staff corrections use an explicit privileged command with a reason and audit record; direct database edits are not the normal workflow.
- If materialized values are stored for fast reads, the event history remains sufficient to reconcile or rebuild them under a documented versioned rule.

These rules are a design boundary, not a claim about Rockstar's internal implementation. They follow CALM's existing server-authority and audit principles.

## Decisions to defer

- Whether CALM should model analogous Strength/Cardio/Focus concepts, and what original ranges or policy would fit its own communities.
- How specific activities affect CALM progression, and at what rate.
- Whether injury, fatigue, hunger, or other needs affect activities or progression.
- Player-visible UI, administration UI, and resets/respecs.
- Any mapping to GTA VI native values, synchronization, or persistence.

Resolve community-design questions with a written server policy before enabling progression. Resolve game mapping only from first-party runtime documentation and authorization. The [domain catalog](./DOMAIN_CATALOG.md#character-progression) and [GTA VI mechanics review](../research/GTA6_RP_MECHANICS_2026-11-25.md) track these boundaries.
