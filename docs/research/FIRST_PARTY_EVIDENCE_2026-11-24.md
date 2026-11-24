# First-party verification record — 24 November 2026

**Purpose:** keep authoritative statements separate from project design and third-party hypotheses. Public claims must be tested against the linked primary source and a date.

| Observation | Confidence and scope | Primary source | Project consequence |
| --- | --- | --- | --- |
| GTA VI released 19 Nov 2026 on PS5 and Xbox Series X/S | CONFIRMED: product release | https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available | Update launch facts; **no inference of RP-server APIs** |
| Cfx.re/FiveM supports GTA V Legacy and Enhanced | CONFIRMED: GTA V only | https://fivem.net/ | Use as reference, not as GTA VI compatibility |
| Cfx scripting docs describe Lua, C# and JavaScript runtimes | CONFIRMED: Cfx product | https://docs.fivem.net/docs/scripting-manual/runtimes/ | Do not advertise GTA VI scripting-language support |
| FiveM exposes network events and recommends server-side validation | CONFIRMED: Cfx product | https://docs.fivem.net/docs/developers/server-security/ | Derive our own neutral intent/authorization contracts |
| Qbox exposes server player and money methods | CONFIRMED: Qbox product | https://docs.qbox.re/resources/qbx_core/exports/server | Compare domain concepts, not game-native names |
| Rockstar permits RP servers through its licensed Creator Platform subject to policies | CONFIRMED: Rockstar policy dated 15 Sep 2026 | https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers | Require a supported/licensed runtime |
| Rockstar warns about unauthorized multiplayer services | CONFIRMED: support policy | https://support.rockstargames.com/articles/LqoRbLhB9zJsqWt8LQFTK/i-found-an-unofficial-gta-multiplayer-server-will-i-get-in-trouble-for-playing-on-or-hosting-one-of-these-servers | No unauthorized server project or circumvention |
| GTA VI public scripting natives, dedicated server binaries, public client events, actor spawning and Cfx compatibility | **UNKNOWN / NOT VERIFIED** | No GTA VI-specific official API was identified in this review | Keep every GTA VI adapter capability unavailable |

## Evidence rules

- A shipped console game is not a developer kit, a PC runtime or a server API.
- Qbox/FiveM function names are **real** within their documented ecosystems, not proven equivalent GTA VI exports.
- An RPF archive marker, game asset name, hash, extracted script or binary offset is not a callable stable API.
- Screenshots, reverse-engineering repositories, claims about console binaries and hashes are insufficient to prove authenticity, redistribution rights, online services or authorized integrations.
- A future adapter must attach: primary vendor documentation, supported runtime/version, permissions review, exact public callable signatures, security semantics, a conformance test suite and a reproducible trace with legally obtained inputs.
- Without this evidence, RT-001 through RT-022 remain UNKNOWN (see server/RUNTIME_REQUIREMENTS.md).

**No proprietary game content is included or required.** This record does not claim Rockstar authorization.
