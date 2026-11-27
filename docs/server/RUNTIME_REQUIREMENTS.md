# GTA VI Runtime Requirements Register

**State:** BLOCKED

This register lists the external runtime capabilities required before the project can bind its game-facing adapter to GTA VI.

It is intentionally a requirements document, not a prediction of how Rockstar Games or Cfx.re will implement those capabilities.

## Status model

- `UNKNOWN` — no legitimate public GTA VI contract establishes the capability.
- `PARTIAL` — public information establishes part of the requirement but not enough to implement safely.
- `CONFIRMED` — public first-party information establishes an implementable contract.
- `VALIDATED` — the confirmed contract has been exercised by this project with conformance tests.

A requirement cannot move to `VALIDATED` before it is `CONFIRMED`.

## Integration requirements

| ID     | Capability required                          | Current state | Why the server needs it                                                |
| ------ | -------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| RT-001 | Authorized community-server/runtime path     | `UNKNOWN`     | Establishes that a legitimate custom RP runtime can exist              |
| RT-002 | Supported host platforms and lifecycle       | `UNKNOWN`     | Determines deployment, process management and infrastructure           |
| RT-003 | Server/client scripting model                | `UNKNOWN`     | Defines where adapter code executes                                    |
| RT-004 | Supported scripting languages/runtimes       | `UNKNOWN`     | Determines adapter implementation language and build chain             |
| RT-005 | Authentication and stable player identifiers | `UNKNOWN`     | Maps runtime sessions to server accounts safely                        |
| RT-006 | Client-to-server event/RPC mechanism         | `UNKNOWN`     | Carries untrusted player intent into authoritative commands            |
| RT-007 | Server-to-client event/state mechanism       | `UNKNOWN`     | Projects authoritative outcomes back to clients                        |
| RT-008 | Entity creation and ownership semantics      | `UNKNOWN`     | Required for vehicles, characters and world entities                   |
| RT-009 | State synchronization/replication semantics  | `UNKNOWN`     | Determines transient world-state adapter behavior                      |
| RT-010 | Player connection/disconnection lifecycle    | `UNKNOWN`     | Required for session state and safe cleanup                            |
| RT-011 | Character/model customization surface        | `UNKNOWN`     | Connects persistent character identity to game representation          |
| RT-012 | Vehicle spawning/state hooks                 | `UNKNOWN`     | Connects durable vehicle ownership to transient entities               |
| RT-013 | Interior/property/door integration           | `UNKNOWN`     | Connects property access rules to the game world                       |
| RT-014 | Interaction/input mechanism                  | `UNKNOWN`     | Enables server-authorized gameplay interactions                        |
| RT-015 | UI/web-view or equivalent integration        | `UNKNOWN`     | Provides in-game interfaces without coupling domain logic to UI        |
| RT-016 | Voice integration path                       | `UNKNOWN`     | Required for proximity/radio/communications if supported               |
| RT-017 | Resource/asset packaging and streaming rules | `UNKNOWN`     | Determines deployable game-facing resources                            |
| RT-018 | Server permissions/admin runtime hooks       | `UNKNOWN`     | Connects staff operations to kick/ban/spectate/runtime actions         |
| RT-019 | Runtime security/anti-cheat boundary         | `UNKNOWN`     | Defines what platform protections exist versus server responsibilities |
| RT-020 | Update/version compatibility model           | `UNKNOWN`     | Determines how runtime updates are qualified before production rollout |
| RT-021 | Hosting/policy/monetization constraints      | `UNKNOWN`     | Ensures server operation remains within authorized policy              |
| RT-022 | Development/test workflow                    | `UNKNOWN`     | Needed for repeatable local/staging integration and conformance tests  |

Rockstar's general RP policy is subject to the Creator Platform rules. As of the 2026-11-27 review, the public Cfx `gamename` documentation lists `gta5` and `rdr3`, but not GTA VI. This does not establish GTA VI eligibility or a future outcome; `RT-001` remains `UNKNOWN` until GTA VI-specific authorization and runtime documentation are available. See [PLATFORM_STATUS.md](../research/PLATFORM_STATUS.md#current-cfx-fxserver-documentation-does-not-list-gta-vi-as-a-supported-game).

## External compatibility research is not an integration contract

CALM's detailed tracking of unofficial PC runners and reverse-engineering projects lives in a separate documentary repository. Those projects may report local execution or rendering progress; they do not establish GTA VI community-server scripting, identity, transport, entity synchronization, authorization or a supported resource API. They do not promote any `RT-*` requirement or unlock `adapters/gta6`.

A [structural research evidence check](../../packages/contracts/src/runtime-evidence.ts) now reports which minimum requirements lack a reviewed first-party contract or a conformance test. Its result is only eligible for **human review**, never automatic permission or runtime validation.

## Technology evidence does not unlock the scripting requirements

Current public Rockstar engineering material confirms substantial use of **C++**, an internal **game script** concept, C++/C# tooling and C#/.NET/web technologies around online services. Current FiveM documentation separately confirms **Lua, JavaScript and C#** scripting runtimes.

Those facts are tracked in [`../research/ROCKSTAR_TECHNOLOGY_BASELINE.md`](../research/ROCKSTAR_TECHNOLOGY_BASELINE.md).

They do **not** change `RT-003` or `RT-004` because neither source set publicly defines a GTA VI community-server scripting contract. In particular:

- Rockstar's internal `game script` must not be treated as a public server scripting API;
- C++ usage inside Rockstar game/Cfx platform engineering does not imply C++ will be the resource language for a future GTA VI server;
- Lua, JavaScript and C# support in current FiveM must not be copied forward as a GTA VI guarantee;
- TypeScript is CALM's current implementation choice for its GTA VI-targeted domains and simulator, not a prediction about the GTA VI runtime.

The adapter language decision therefore remains intentionally deferred until the relevant GTA VI runtime contract is public and implementable.

## Requirement acceptance template

Before changing any row to `CONFIRMED`, record:

- first-party source;
- publication/update date when available;
- verification date;
- exact supported capability;
- relevant limitations;
- minimum supported runtime/version if applicable;
- corresponding entry in `docs/research/PLATFORM_STATUS.md`;
- ADR needed for any architectural coupling.

Before changing any row to `VALIDATED`, add:

- adapter contract or port;
- conformance test location;
- tested runtime/version;
- failure behavior;
- known compatibility constraints.

## Adapter unlock gate

`adapters/gta6` may contain scaffolding, interfaces and tests that do not pretend to call a real GTA VI API. Runtime-specific implementation begins only when the minimum path below is confirmed:

1. `RT-001` authorized runtime path;
2. `RT-003` scripting model;
3. `RT-005` identity/session mapping;
4. `RT-006` client-to-server communication;
5. `RT-007` server-to-client communication;
6. `RT-010` connection lifecycle;
7. enough of `RT-008`/`RT-009` to model authoritative world interaction safely.

Individual server features may require additional confirmed rows before their GTA VI-facing integration can ship.

## Current conclusion

The domain, persistence model, simulator, security rules and operational preparation can advance independently.

Real GTA VI adapter work remains blocked because the required public runtime contract has not been established in this repository's verified platform status.
