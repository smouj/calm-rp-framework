# GTA VI RP / Community Server Platform Status

**Targeted update:** 2026-11-27 — GTA VI launch, platform availability, RP policy and current Cfx supported-game list; older sections retain their original per-source verification dates.

This document is the project's source-of-truth snapshot for what is publicly confirmed versus what remains unknown. It must be updated before GTA VI-specific adapter work is approved.

## Confirmed

### GTA VI released on PlayStation 5 and Xbox Series X|S

**Classification:** `CONFIRMED` for the official game's release and supported console platforms; **not** a community-server authorization.

Rockstar's **November 19, 2026** Newswire announcement says Grand Theft Auto VI is now available. The official product page identifies **PlayStation 5** and **Xbox Series X|S** as launch platforms; PlayStation's current store page lists a **single-player** product. This targeted 2026-11-23 review found no first-party PC release or GTA VI custom-server developer contract. Lack of a confirmed contract is **not** a claim that future PC, online or creator features will never be announced.

Official sources:

- Rockstar Games — _Grand Theft Auto VI Now Available_ (2026-11-19): https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available
- Rockstar Games — product page: https://www.rockstargames.com/VI
- PlayStation Store — GTA VI product metadata (verified 2026-11-23): https://store.playstation.com/es-es/product/EP1004-PPSA01547_00-GTAVISTANDARD001
- Rockstar Support — platform editions and versions: https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions

### GTA VI is distributed as a single-player experience

**Classification:** `CONFIRMED` for the currently announced **Grand Theft Auto VI product experience**. This does **not** establish that Rockstar will never announce a separate or later multiplayer product or service.

On **June 24, 2026**, Rockstar Games announced GTA VI pre-orders and explicitly described **Grand Theft Auto VI as a single-player experience**. PlayStation's current GTA VI product page independently presents the title as **1 player** and answers its multiplayer FAQ by stating that GTA VI is a single-player experience.

Exact claim supported:

- the currently announced GTA VI product is single-player;
- Rockstar has not publicly announced GTA VI multiplayer as part of the currently documented launch product;
- current PlayStation product metadata does not expose an online-player mode for GTA VI.

What this does **not** establish:

- that Rockstar will never announce GTA VI multiplayer, a successor to GTA Online, or another online service;
- that GTA VI will never receive community-server support;
- a GTA VI Cfx.re/FiveM-equivalent runtime or product;
- GTA VI server binaries, APIs, natives, scripting languages, synchronization semantics, resource formats or hosting requirements;
- a GTA VI PC release.

**Project impact:** this strengthens the block on speculative GTA VI RP integration. The repository must not model a launch-day GTA VI multiplayer contract that Rockstar has not announced. The game-agnostic core, simulator and Cfx research boundary remain valid preparation work, but GTA VI-specific online/runtime integration stays gated behind future first-party evidence.

**Affected project references:** `server/RUNTIME_REQUIREMENTS.md` remains unchanged because no GTA VI community-runtime capability has been confirmed; all GTA VI `RT-*` requirements remain `UNKNOWN`. Existing ADRs remain valid and no roadmap integration gate advances. The roadmap should continue treating GTA VI adapter/runtime implementation as externally blocked until a legitimate multiplayer/community-server path is publicly documented.

Official sources:

- Rockstar Games Newswire — _Pre-Order Grand Theft Auto VI on June 25_, published 2026-06-24: https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25
- PlayStation — _Grand Theft Auto VI_, verified 2026-09-09: https://www.playstation.com/es-es/games/grand-theft-auto-vi/

### Rockstar recognizes Cfx.re community servers for current GTA titles

Rockstar Support states that authorized Grand Theft Auto roleplay/community servers are supported through the **Cfx.re Platform Server (FXServer)** path for the current supported ecosystem.

Official sources:

- https://support.rockstargames.com/articles/LqoRbLhB9zJsqWt8LQFTK/i-found-an-unofficial-gta-multiplayer-server-will-i-get-in-trouble-for-playing-on-or-hosting-one-of-these-servers
- https://support.rockstargames.com/articles/76vEOw8QDFtbtIxObtR5xM/support-for-rockstar-games-authorized-roleplay-and-community-created-servers
- https://support.cfx.re/hc/en-us/sections/8856819954332-Community-Servers

### Rockstar directly supports nopixel V distribution through Rockstar Games Launcher

**Classification:** `CONFIRMED` for the current **Grand Theft Auto V roleplay ecosystem**. This is **not** a GTA VI runtime confirmation.

On **September 1, 2026**, Rockstar Games officially announced **nopixel V** as the next evolution of the GTAV roleplay community. Rockstar states that its closed beta begins **September 8, 2026** and that invited players will access the experience through the **Rockstar Games Launcher**. Rockstar also describes GTA Roleplay as a community-run multiplayer version of Los Santos and explicitly states that it is supporting nopixel.

Exact claim supported:

- Rockstar is directly promoting and supporting a named GTAV roleplay experience;
- Rockstar Games Launcher is an official access/distribution surface for the nopixel V closed beta;
- Rockstar publicly characterizes GTA Roleplay as a community-run multiplayer experience.

What this does **not** establish:

- a GTA VI community-server runtime;
- a GTA VI Cfx.re/FiveM-equivalent product;
- GTA VI server binaries, APIs, natives, scripting languages, synchronization semantics or resource formats;
- a GTA VI PC release or a Rockstar Games Launcher distribution contract for GTA VI roleplay;
- portability of nopixel V/FiveM architecture to GTA VI.

**Project impact:** this materially strengthens the evidence that Rockstar is investing in and operationally integrating the current RP ecosystem, including launcher-level distribution. It is useful planning evidence for authentication, distribution and creator-platform research, but it does not unlock any GTA VI adapter requirement. All GTA VI `RT-*` integration requirements remain `UNKNOWN` unless separately confirmed by GTA VI-specific first-party documentation.

Official source:

- Rockstar Games Newswire — _Introducing nopixel V_, published 2026-09-01: https://www.rockstargames.com/newswire/article/17857581o753k1/introducing-nopixel-v

### Rockstar Games Launcher explicitly interoperates with FiveM

**Classification:** `CONFIRMED` for the current **Rockstar Games Launcher / FiveM ecosystem**. This is **not** a GTA VI runtime confirmation.

On **September 3, 2026**, Rockstar Games published Rockstar Games Launcher update `1.0.109.3031`. Its official release notes explicitly state that the update includes **improvements to the interoperability of the Rockstar Games Launcher with FiveM**.

Exact claim supported:

- Rockstar maintains launcher-level interoperability with FiveM as an explicit supported engineering concern;
- FiveM interoperability is now named directly in first-party Rockstar Games Launcher release notes;
- the current Cfx/FiveM ecosystem has an operational integration surface with Rockstar Games Launcher beyond generic account or support references.

What this does **not** establish:

- a GTA VI Cfx.re/FiveM runtime or product;
- that GTA VI will use Rockstar Games Launcher for community-server access;
- a GTA VI PC release;
- any GTA VI scripting language, API, native-function set, networking contract, synchronization model, resource format or server binary;
- portability of the current FiveM launcher integration to GTA VI.

**Project impact:** this strengthens the current-ecosystem evidence behind treating launcher/runtime compatibility as a first-class adapter and operations concern. The project should preserve explicit version and compatibility boundaries between game, launcher, runtime and adapter layers. No GTA VI `RT-*` requirement changes state, no ADR is unlocked, and no roadmap gate advances because the evidence is not GTA VI-specific.

**Affected project references:** `server/RUNTIME_REQUIREMENTS.md` remains unchanged; all GTA VI runtime requirements stay `UNKNOWN`. Existing game-agnostic architecture and adapter-boundary ADRs remain valid. This finding informs future compatibility-matrix and deployment planning only.

Official source:

- Rockstar Games Support — _Rockstar Games Launcher Update 1.0.109.3031 Notes_, updated 2026-09-03: https://support.rockstargames.com/articles/2N4ztI3jnLAEP77euIvhBD/rockstar-games-launcher-update-1-0-109-3031-notes

### Rockstar service status monitors Cfx as a first-party operational surface

**Classification:** `CONFIRMED` for the current **Rockstar/Cfx operational ecosystem**. This is **not** a GTA VI runtime confirmation.

On **September 12, 2026**, Rockstar Games Support's official Service Status page publicly exposes a dedicated **Cfx** section alongside Rockstar's other online services. The Cfx section reports operational state for **Authentication**, **FiveM**, **RedM**, **Community Servers**, and **Marketplace**.

Exact claim supported:

- Rockstar publicly treats Cfx availability as a monitored operational service surface;
- Cfx authentication, FiveM, RedM, Community Servers and Marketplace are represented as individually observable service components on Rockstar's first-party status page;
- availability and dependency monitoring for the current creator/community-server ecosystem is therefore an explicit operational concern within Rockstar's public support surface.

What this does **not** establish:

- a GTA VI community-server runtime or Cfx/FiveM-equivalent product;
- that these same service components will be used by GTA VI;
- GTA VI authentication identifiers, server binaries, APIs, scripting languages, synchronization semantics, resource formats or deployment topology;
- a GTA VI PC release;
- any guarantee that the current Cfx component taxonomy is a future GTA VI service contract.

**Project impact:** this strengthens the case for keeping authentication, runtime availability, community-server availability and marketplace/resource distribution as separately observable operational dependencies in future adapter and operations planning. It supports the existing game-agnostic operations boundary, but it does not unlock implementation of a GTA VI adapter.

**Affected project references:** `server/RUNTIME_REQUIREMENTS.md` remains unchanged and all GTA VI `RT-*` requirements remain `UNKNOWN`. No existing ADR changes state and no roadmap integration gate advances. The finding is planning evidence for observability, dependency health and incident-response design only.

Official source:

- Rockstar Games Support — _Service Status_, verified 2026-09-12: https://support.rockstargames.com/servicestatus?lang=en

### Rockstar allows RP through its Creator Platform, subject to policy

**Classification:** `CONFIRMED` only for the scope of Rockstar's stated Creator Platform policies. It does **not** confirm a GTA VI creator runtime or provide blanket permission for a GTA VI multiplayer modification.

Rockstar Support's RP guidance (updated **2026-09-15**) states that RP servers are allowed **through its Creator Platform**, provided they follow the applicable policies, including the Creator Platform License Agreement and mod guidelines. This project's future GTA VI integration requires a separate verified authorization and a supported technical pathway.

Official sources:

- Rockstar Support — RP policy: https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers
- Rockstar — mod guidelines: https://www.rockstargames.com/es/community-resources/mod-guidelines
- Cfx — Creator Platform License Agreement: https://fivem.net/terms/

### Current Cfx FXServer documentation does not list GTA VI as a supported game

**Classification:** `CONFIRMED` for what the current public FXServer documentation lists; this is **not** proof that Rockstar will never publish a separate GTA VI creator runtime.

The Cfx server-command reference's `gamename` section lists two supported games: `gta5` (FiveM) and `rdr3` (RedM). It does not list GTA VI. The Creator Platform License Agreement defines a “Covered Game” as a Rockstar game authorized for Creator Services, but the agreement itself does not enumerate that list. Read together with Rockstar's general RP policy, these sources confirm RP under the Creator Platform for covered games, but do **not** establish that GTA VI is currently a covered/supported game or provide a GTA VI multiplayer/stat interface.

**Project impact:** keep `RT-001` (authorized GTA VI community-server/runtime path), `RT-003` (scripting model), and all other GTA VI `RT-*` requirements `UNKNOWN`. Revisit only when Rockstar/Cfx publishes GTA VI-specific eligibility and technical documentation. This is a dated documentation snapshot, not a prediction about future support.

Official sources:

- Cfx Documentation — [Server Commands: `gamename` and supported games](https://docs.fivem.net/docs/server-manual/server-commands/), reviewed 2026-11-27.
- Rockstar Support — [RP server policies](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers), updated 2026-09-15.
- Cfx — [Creator Platform License Agreement](https://fivem.net/terms/), updated 2026-09-10, §§1.2 and 2.

### Cfx.re is part of Rockstar Games

Cfx.re announced in 2023 that the team behind FiveM and RedM joined Rockstar Games. In that announcement, Cfx.re explicitly said the partnership was focused on **FiveM and RedM** and told users not to ask them about the next GTA.

Official source:

- https://forum.cfx.re/t/cfx-re-officially-joins-rockstar-games/5158920

### Cfx player identifiers can be removed or changed

**Classification:** `CONFIRMED` for the documented **current FiveM/RedM identifier ecosystem** only. These records are a retrospective first-party evidence gap in this repository, not newly published October 2026 GTA VI specifications.

**Identifier-type deprecation (FiveM).** On **April 14, 2026**, Cfx.re announced that the `xbl:` (Xbox Live) and `live:` (Microsoft PUID) identifier types would be removed from `GetPlayerIdentifiers` on **April 27, 2026**, citing platform integrity and player privacy. Current Cfx documentation for `GetPlayerIdentifiers` lists `steam`, `discord`, `license`, `license2`, `fivem`, and `ip` but not `xbl` or `live`. This supports the announced deprecation and current documented identifier set; it does not establish a GTA VI identifier scheme or guarantee that every third-party server resource has migrated.

- Publisher: Cfx.re / Cfx Forum — _Deprecation Notice: Xbox Live and Microsoft Player Identifiers_, published **2026-04-14**: https://forum.cfx.re/t/deprecation-notice-xbox-live-and-microsoft-player-identifiers/5397645
- Publisher: Cfx.re — _GetPlayerIdentifiers_, publication/update date not displayed, verified **2026-10-30**: https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/GetPlayerIdentifiers/

**License-identifier changes (FiveM/RedM).** In an official announcement dated **June 1, 2026**, Cfx.re said an account-security update scheduled to start **June 24, 2026** would gradually change `license:` and/or `license2:` identifiers for a **small number of players**. Depending on a server's persistence mapping, affected players could temporarily lose access to their characters/progression. Cfx.re documented selecting an alternative linked identity, with a self-service change window until **June 24, 2027**, after which affected players would need server-staff assistance. The announcement is evidence of an explicitly documented identifier-change/migration risk; it does **not** prove every account changed, provide a universal migration algorithm, or confirm a GTA VI authentication contract.

- Publisher: Cfx.re / Cfx Forum — _Important Account Security Update_, published **2026-06-01** (scheduled rollout from 2026-06-24): https://forum.cfx.re/t/important-account-security-update/5406794

**Verified:** **2026-10-30**.

**Project impact:** current Cfx identifier types are not a permanent universal identity contract. The project should account for external identifier deprecation and legitimate identity remapping when reviewing the **P2 account/session and character lifecycle** and **P4 Cfx research** boundaries, including recovery/audit and the existing **T-006 identifier-substitution** threat. These findings inform future tests and review of identity mapping; they do not authorize a FiveM-specific identity schema in the game-agnostic core, establish a migration implementation, or change durable architecture.

**Affected references:** `RT-005` (GTA VI authentication/stable player identifiers) remains `UNKNOWN`; `RT-001` and other GTA VI runtime requirements remain `UNKNOWN`. **P5** stays blocked. **ADR-0001** (game-agnostic core) and **ADR-0004** (PostgreSQL authoritative state) remain unchanged. No GTA VI adapter or production security behavior should be implemented from this evidence. Because the finding concerns identity/security interpretation, this research change requires **human review and must not be auto-merged**, even if CI becomes green.

### Cfx Portal becomes the management surface for public server metadata

**Classification:** `CONFIRMED` for the current **FiveM/RedM server-list ecosystem**. This is **not** a GTA VI runtime confirmation.

On **October 14, 2026**, Cfx.re announced that public server metadata previously configured locally in server configuration files — including server name, description, tags, language and imagery — was moving to management through the **Cfx Portal**. On **October 21, 2026**, Cfx.re updated the same first-party announcement to confirm that the server-metadata changes had rolled out across FiveM and RedM: names, descriptions, tags, language settings, imagery and the associated Discord link are now managed through Cfx Portal. Servers without required Portal metadata are shown as missing server data in the server list. The update also limits public server tags to five and publishes updated banner/profile-image requirements.

**Exact claim supported:**

- Cfx Portal is becoming the authoritative management surface for key public FiveM/RedM server-list metadata;
- deployment/runtime configuration and public discovery metadata are no longer fully co-located in local server configuration;
- current Cfx operations therefore require a separate Portal-managed publishing/discovery surface in addition to FXServer configuration.

**Publisher:** Cfx.re / Cfx Forum (system, Announcements)

**Published:** 2026-10-14

**Verified:** 2026-10-26

**Evidence classification:** `CONFIRMED` for current FiveM/RedM operations.

**Limitations:** this announcement applies to the current FiveM/RedM ecosystem. It does not establish a GTA VI community-server runtime, GTA VI Cfx product, GTA VI server-list contract, GTA VI Portal metadata schema, GTA VI hosting model, GTA VI PC release, or portability of these operational requirements to GTA VI.

**Project impact:** preserve a clean boundary between runtime/server configuration and externally managed discovery/publishing metadata. Future deployment tooling should treat creator-portal/server-list metadata as an adapter-owned operational concern rather than hard-coding current FiveM/RedM fields into the game-agnostic domain. No GTA VI implementation should be added from this evidence.

**Affected project references:** `server/RUNTIME_REQUIREMENTS.md` remains unchanged and all GTA VI `RT-*` requirements remain `UNKNOWN`. Existing adapter-boundary and external-platform dependency ADRs remain valid; no GTA VI roadmap gate advances. The finding should inform future deployment/operations planning only.

Official source:

- Cfx.re — _Portal Update: Server Metadata Management_, published 2026-10-14; rollout confirmation added 2026-10-21; verified 2026-10-26: https://forum.cfx.re/t/portal-update-server-metadata-management/5431315

### FiveM for GTAV Enhanced confirms version-coupled client/server protocol changes

**Classification:** `CONFIRMED` for the current **FiveM for GTAV Enhanced Early Access** ecosystem. This is **not** a GTA VI runtime confirmation.

On **September 30, 2026**, Cfx Admin published official FiveM for GTAV Enhanced Early Access patch notes documenting network-protocol changes that require servers to update to the latest `cfx-server` build for compatible clients to connect. The same update documents changes to state-bag limits, network-event rate limiting, parallel synchronization processing, and connection/disconnection handling under load.

Exact claim supported:

- current Cfx client/server compatibility can be version-coupled by protocol changes;
- a client update can require a corresponding FXServer update;
- Cfx is actively changing synchronization, event-rate and state-distribution behavior during GTAV Enhanced Early Access;
- deployment planning for the current Cfx ecosystem therefore needs explicit client/server compatibility checks and rollback discipline.

What this does **not** establish:

- a GTA VI Cfx/FiveM runtime or product;
- that GTA VI will inherit FiveM for GTAV Enhanced networking, state bags, events, synchronization or versioning behavior;
- GTA VI server binaries, APIs, scripting languages, resource formats or hosting requirements;
- a GTA VI PC release.

**Project impact:** retain strict version boundaries and compatibility-matrix/rollback planning in the game-agnostic operations model. Treat this as a current-Cfx engineering signal only; do not implement GTA VI-specific runtime behavior from it.

**Affected project references:** `server/RUNTIME_REQUIREMENTS.md` remains unchanged and all GTA VI `RT-*` requirements remain `UNKNOWN`. No ADR changes state and no GTA VI roadmap integration gate advances.

Official source:

- Cfx Admin — _FiveM for GTAV Enhanced: Early Access Patch Notes September 30_, published 2026-09-30; verified 2026-10-04: https://github.com/citizenfx/rfc/discussions/564

### FiveM for GTAV Enhanced migration guide confirms breaking runtime semantics

**Classification:** `CONFIRMED` only for the currently documented **FiveM for GTAV Enhanced** runtime. **Not** a GTA VI community-server contract.

Cfx.re's first-party developer migration guide documents multiple breaking differences between FiveM for GTAV Legacy and FiveM for GTAV Enhanced. The page does not expose a publication or last-updated date; its contents were **verified on 2026-10-29**.

**Exact claims supported:**

- Enhanced replaces peer-to-peer synchronization with a client-server synchronization model; OneSync non-big mode is removed, leaving big mode as the only mode. Player connect/disconnect event scoping is therefore different from Legacy.
- Server-side player IDs are released on disconnect and may be reused for the next connecting player, unlike Legacy's incrementing assignment until wraparound. Cfx.re explicitly warns this behavior may change.
- State-bag callbacks fire only if the entity exists, and replicated values are replicated only when explicitly set.
- Resource asset compatibility may require separate `stream_enhanced` assets, with `stream` serving as a fallback; `stream` is deprecated in this context.
- Enhanced replaces Mono with .NET and the guide specifies a .NET 10 SDK for development. The guide also documents removed/deprecated server features and configuration variables, including OneSync non-big mode, HTTP/2 support through `sv_netHttp2`, and current lack of Asset Escrow implementation.

**Publisher:** Cfx.re, official FiveM developer documentation.

**Published/updated:** not provided by the source (do not infer a date).

**Verified:** 2026-10-29.

**Limitations:** these are FiveM for GTAV Enhanced migration semantics, not Rockstar GTA VI product/runtime documentation. The page describes current Enhanced behavior, including early-access limitations and explicitly changeable player-ID assignment. It does not establish a GTA VI multiplayer mode, authorized GTA VI community-server runtime, host binaries, scripting contract, authentication model, synchronization API, PC release or supported migration path from FiveM.

**Project impact:** reinforces the existing game-agnostic adapter boundary and the need for version-specific conformance tests. Never treat a transient runtime player ID as a durable account identifier; keep session identity and domain identity separate. Plan compatibility checks for client/server versions, synchronization semantics, resource variants and lifecycle event scoping in the Cfx research lab. These are design safeguards, not claims about GTA VI.

**Affected references:** `RT-003`, `RT-004`, `RT-005`, `RT-008`, `RT-009`, `RT-010`, `RT-017`, `RT-020` and `RT-022` remain `UNKNOWN` for GTA VI; no row in `docs/server/RUNTIME_REQUIREMENTS.md` changes. `ADR-0001` (game-agnostic core and adapters) remains accepted. `docs/roadmap/ROADMAP.md` P4 may use this as a research/conformance reference, while P5 remains blocked. No runtime code or architecture change is authorized.

Official source:

- Cfx.re — _What's Changed in FiveM for GTAV Enhanced_, publication/update date not shown; verified 2026-10-29: https://docs.fivem.net/docs/developers/legacy-vs-enhanced/

## Confirmed technology signals outside a GTA VI contract

Public first-party material establishes a useful **current Rockstar/Cfx engineering baseline** without establishing GTA VI-specific implementation details:

- Rockstar Gameplay Programming publicly describes core gameplay systems and control interfaces built with a combination of **C++ and game script**;
- Rockstar graphics engineering uses **C++** and modern graphics APIs, with shader-programming experience such as **HLSL** relevant to graphics roles;
- Rockstar production/animation tooling uses **C++ and/or C#**;
- Rockstar Online Services publicly uses **C#/.NET**, SQL and web technologies including **JavaScript/TypeScript + React**;
- Rockstar currently recruits **C++** engineers for the Cfx.re creator platforms, including FiveM and RedM;
- current FiveM documentation exposes **Lua, JavaScript and C#** scripting runtimes;
- Rockstar now publicly supports a named GTAV roleplay experience distributed to invited players through Rockstar Games Launcher;
- Rockstar Games Launcher release notes explicitly identify **FiveM interoperability** as a supported compatibility concern;
- Rockstar's first-party Service Status surface separately monitors Cfx authentication, FiveM, RedM, Community Servers and Marketplace.

These are confirmed statements about current public Rockstar/Cfx engineering, RP-platform and operational practice. They are **not** evidence that GTA VI community servers will expose any particular language, runtime, service taxonomy or launcher path.

Canonical evidence matrix and source list:

- [`ROCKSTAR_TECHNOLOGY_BASELINE.md`](./ROCKSTAR_TECHNOLOGY_BASELINE.md)

## Not publicly confirmed for GTA VI

As of the verification date, this project has **no legitimate public source** confirming any of the following specifically for GTA VI:

- any multiplayer mode or online service for the currently announced GTA VI product;
- the complete implementation language set used by GTA VI;
- the exact definition, syntax or runtime of Rockstar's internal "game script" in GTA VI;
- a FiveM-equivalent GTA VI client;
- a GTA VI Cfx.re product name;
- GTA VI community-server binaries;
- GTA VI dedicated-server hosting requirements;
- GTA VI RP APIs;
- GTA VI native-function documentation;
- GTA VI server scripting languages;
- GTA VI resource manifests;
- GTA VI synchronization/entity-ownership semantics;
- GTA VI web/NUI integration;
- GTA VI voice API;
- GTA VI server-side asset streaming/modding API;
- GTA VI anti-cheat hooks for community servers;
- GTA VI community-server authentication/identifier model;
- a GTA VI PC release/runtime suitable for current FiveM-style assumptions.

These items are requirements/unknowns, not TODOs that should be implemented speculatively.

## What current FiveM/RedM and Rockstar-supported RP can tell us

The existing Cfx.re ecosystem and Rockstar's direct support for nopixel V are useful for studying **design patterns and operational surfaces**:

- server-authoritative validation;
- client/server event boundaries;
- resource isolation;
- Lua/JavaScript/C# scripting patterns;
- web-based in-game UI patterns;
- entity ownership and synchronization concerns;
- server operations, permissions and moderation;
- common security mistakes in RP resources;
- launcher/account integration as a current-ecosystem distribution concern;
- explicit launcher/runtime interoperability and version-compatibility concerns;
- first-party service-health monitoring for Cfx authentication, runtimes, community servers and marketplace availability.

However, no current FiveM/RedM/nopixel V behavior, launcher integration or Cfx service-status taxonomy is automatically a GTA VI contract.

## Project policy for rumors and leaks

Rumors, social-media claims, leaked material, private APIs and reverse-engineered Rockstar services must not be promoted to `Confirmed`.

Research entries should be classified as one of:

| State             | Meaning                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `CONFIRMED`       | Public first-party Rockstar/Cfx.re documentation or announcement       |
| `PUBLIC_OBSERVED` | Publicly observable current ecosystem behavior, not a GTA VI guarantee |
| `INFERENCE`       | Reasoned planning assumption that must not become an adapter contract  |
| `RUMOR`           | Unverified; never used as an implementation dependency                 |
| `UNKNOWN`         | Required information has not been publicly established                 |

Leaked or stolen source code is not admissible implementation evidence. If a claim later becomes independently documented through a legitimate public first-party source, the public source — not the leak — becomes the project's evidence.

## GTA VI integration unlock checklist

Before moving `adapters/gta6` beyond a placeholder, identify public answers for the minimum viable set below:

- [ ] legitimate community-server/runtime path
- [ ] supported host operating systems
- [ ] server lifecycle / binary distribution
- [ ] authentication and player identifiers
- [ ] client/server scripting model
- [ ] supported scripting languages/runtimes
- [ ] event/RPC mechanism
- [ ] entity creation and ownership
- [ ] synchronization/state replication
- [ ] persistence expectations
- [ ] UI/web-view mechanism
- [ ] voice integration path
- [ ] permissions/security model
- [ ] asset/resource packaging rules
- [ ] platform policy / monetization constraints
- [ ] development and production deployment workflow

When those answers become available, update this file first, then create the relevant ADRs and conformance tests.
