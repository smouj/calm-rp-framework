# Public functions, interface contracts and RAGE 9 research matrix

**Review date:** 24 November 2026. Goal: adapt our **original server architecture**, not reproduce GTA VI internals.

## 1. Functions that are really documented today

These names refer to **FiveM/Qbox for supported existing GTA V ecosystems only**. They are not GTA VI native functions.

| Publicly documented symbol / call | Documented ecosystem | Design meaning for our original core | GTA VI equivalent |
| --- | --- | --- | --- |
| `RegisterNetEvent` | FiveM/Cfx | Register a network-exposed event listener; validate client-supplied input on server | **UNKNOWN** |
| `AddEventHandler` | FiveM/Cfx | Listen for local non-network events | **UNKNOWN** |
| `TriggerServerEvent` | FiveM/Cfx | Send client intent to server; **not** a trusted state mutation | **UNKNOWN** |
| `TriggerClientEvent` | FiveM/Cfx | Send server result/projection to a client | **UNKNOWN** |
| `exports.qbx_core:GetPlayer(source)` | Qbox | Look up player session object | **UNKNOWN** |
| `QBCore.Functions.GetPlayer(source)` | QBCore | Lookup in the QBCore public abstraction | **UNKNOWN** |
| `exports.qbx_core:AddMoney(source,type,amount,reason)` | Qbox | Authoritative credit workflow with auditable reason | **UNKNOWN** |
| `exports.qbx_core:RemoveMoney(source,type,amount,reason)` | Qbox | Authoritative debit workflow | **UNKNOWN** |
| `exports.ox_inventory:GetItemCount(source,item)` | ox_inventory/Qbox docs | Query inventory; not proof of GTA VI inventory native | **UNKNOWN** |

Primary public documentation:
- https://docs.fivem.net/docs/developers/server-security/
- https://docs.fivem.net/docs/scripting-manual/working-with-events/
- https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/TriggerServerEvent/
- https://docs.qbox.re/migrating/converting-resources
- https://docs.qbox.re/resources/qbx_core/exports/server

Do **not** embed these names as GTA VI-facing APIs, silently port Lua FiveM resources or use user-reported balances as authoritative. Build neutral commands and projections within `packages/contracts` and translate them only in a properly supported adapter.

## 2. Public RAGE 9 format research: useful, but not callable functions

| Public third-party research | Observed/reported area | What it informs | What it does **not** prove |
| --- | --- | --- | --- |
| `Ahmet-Dedeler/rage9-re` | `script.rpf` data graphs, `PSIN`, `LSCH`, `LENM`, `LSNS`, `LGID`, `LRSC`, `CHKS`, `anim.rpf` | Schema/versioning and object lifecycle planning | Public GTA VI script execution API, callable events or multiplayer |
| `holdmysocks/SixNG` | RPF9 model/texture/world extraction experiments; declared gaps in TOC, BC codecs and formats | Design abstract resource descriptors, no game data | Valid IP redistribution, runtime API, playable server |
| `breadbbbb/rpf9-explorer` | Indexing and preview of archive types | Future asset adapter boundary | Documented GTA VI API or game code |
| `R0Y00/Xbox2Windows` | Experimental Windows translation, diagnostic boot claims, synthetic tests | Capability/version manifest and portability constraints | Reliable playable Windows release or authorized online server |
| `Marvisak/VIctory` | Project-claimed offline boot/menus; incomplete world rendering | Runtime lifecycle research only | Working gameplay or multiplayer services |
| `ItsNotRexed/Leonida` | Earlier recompilation/format claims; original GitHub URL returned 404 at review time | Historical context, do not rely on it as a live integration dependency | Source availability, authorized adapter, verified build |

Repositories:
- https://github.com/Ahmet-Dedeler/rage9-re (MIT OR Apache-2.0 per README)
- https://github.com/holdmysocks/SixNG (GPL-3.0)
- https://github.com/breadbbbb/rpf9-explorer (license requires manual inspection; do not reuse code)
- https://github.com/R0Y00/Xbox2Windows (MIT per GitHub)
- https://github.com/Marvisak/VIctory (GPL-3.0)
- Historical link https://github.com/ItsNotRexed/Leonida (404 in authenticated repository metadata on 2026-11-24)
- Curated external index https://github.com/Ahmet-Dedeler/awesome-gta6-reverse-engineering

These are **third-party self-descriptions** and should be checked against tested revisions before treating claims as reproducible.

## 3. The independent capability contract we have added

`packages/contracts/src/runtime-port.ts` declares **our own** capabilities:

| Our name | Purpose | Example pre-runtime work |
| --- | --- | --- |
| `session.resolve` | Map a trusted connection/session to account identity | Synthetic session directory |
| `intent.receive` | Receive untrusted player command intent | Auth+validate+authorize tests |
| `projection.send` | Project server-confirmed results | Fake notifier |
| `entity.reference` | Associate durable domain ID with transient world entity | In-memory mapping |
| `location.query` | Query synthetic coordinate-space model | Spatial lookup |
| `world.interact` | Request a server-validated world action | Permission rules |
| `resource.lifecycle` | Detect availability of versioned resources | Mock version registry |

These names and TypeScript signatures are our own portable contracts, not Rockstar nomenclature or extracted native interfaces. The exported `GTA6_UNVERIFIED_CAPABILITIES` is intentionally empty, and `requireRuntimeCapabilities` fails closed if an essential capability is missing. **No GTA VI game adapter is implemented.**

## 4. What we still need to learn legitimately

Official GTA VI-specific evidence for `RT-001` (authorization), `RT-003` (scripting model), `RT-005` (identity), `RT-006/7` (events), `RT-008/9` (entities/synchronization), `RT-010` (session lifecycle), `RT-017` (resources). Never upgrade these requirements because an archive viewer recognizes a format or someone reports a launcher screen.

See [legal review](../legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md), [runtime requirements](../server/RUNTIME_REQUIREMENTS.md), [research protocol](./RESEARCH_PROTOCOL.md).
