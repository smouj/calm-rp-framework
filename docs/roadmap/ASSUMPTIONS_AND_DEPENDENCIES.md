# Assumptions, external dependencies and proof gates

**Review:** 24 November 2026. **Status:** active planning; _not a GTA VI API claim_. This consolidates relevant elements from draft PR #24 without reviving the prior single-server scope. The repository now targets a reusable game-independent RP foundation.

## Confirmed, product-scoped observations

- Rockstar officially released GTA VI on supported consoles on 19 November 2026. This is a **game release** only: https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available
- Rockstar's current licensed Creator Platform and RP policy applies to the supported ecosystem; it does **not** grant GTA VI server permission: https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers
- Cfx has public FiveM/RedM scripting and event contracts, but those do **not** establish GTA VI functions: https://docs.fivem.net/docs/developers/server-security/
- Current Cfx identity identifiers may change and clients/servers may need version-specific migrations: https://forum.cfx.re/t/important-account-security-update/5406794 and https://docs.fivem.net/docs/developers/legacy-vs-enhanced/

## Hypotheses, not facts

- A GTA VI-compatible third-party creator runtime may someday be made available.
- A future adapter may have equivalents of identity, client intents, server projections, world references and resource lifecycle.
- A GTA VI runtime may impose constraints unlike today's Cfx/FiveM; the platform, networking model, license and runtime APIs are UNKNOWN.

## External proof gates

| Gate                     | Evidence required                                              | Current decision |
| ------------------------ | -------------------------------------------------------------- | ---------------- |
| Runtime permission       | First-party GTA VI-specific terms and license                  | **BLOCKED**      |
| Supported host/platform  | Official deployment and target-platform documentation          | **UNKNOWN**      |
| Public scripting ABI     | Official callable functions and versions                       | **UNKNOWN**      |
| Identity and reconnect   | Authorized identity, rotation and lifecycle contract           | **UNKNOWN**      |
| Events and security      | Client/server event and validation semantics                   | **UNKNOWN**      |
| Entities and ownership   | Server entity/synchronization contract                         | **UNKNOWN**      |
| Asset/resource lifecycle | Public authorized resource format and redistribution terms     | **UNKNOWN**      |
| Compatibility            | Published runtime/game/client version matrix                   | **UNKNOWN**      |
| Production readiness     | Reproducible tests, legal review, history audit and working CI | **BLOCKED**      |

Never copy symbols, maps, archives, native offsets or leaked files as a substitute for these gates. The current neutral `packages/core`, `packages/contracts`, simulator and planned durable persistence are valid independent engineering work.

## Reversible decisions

- Keep the modular monolith architecture, independent command/event types, synthetic scenarios, simple in-memory references and documented prototype status.
- Defer any irreversible choice of GTA VI-specific engine bindings, client sync protocol, resource signature, game asset importer, launcher/runtime dependency and distribution contract.
- If GTA VI never has an authorized compatible runtime, the independent RP framework must remain valuable as generic software and simulator modules.

See [RISK_REGISTER](./RISK_REGISTER.md), [runtime requirements](../server/RUNTIME_REQUIREMENTS.md), [first-party evidence](../research/FIRST_PARTY_EVIDENCE_2026-11-24.md), and [research protocol](../research/RESEARCH_PROTOCOL.md).

Historical draft review context: PR #24, 31 October 2026. Updated to reflect the November game launch and newer community-platform scope.
