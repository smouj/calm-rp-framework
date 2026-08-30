# Future GTA VI RP Server Blueprint

This is the design skeleton for **our own future roleplay server**. It describes the product and operational areas we can prepare before GTA VI community-server technology is known.

It is intentionally not a FiveM framework specification.

## 1. Server identity

Decisions to define before implementation:

- community name and visual identity;
- roleplay style and expected player behavior;
- whitelist/open-access model;
- minimum age and moderation policy, if any;
- target language(s);
- target region/time zone;
- expected session length and progression speed;
- realism vs accessibility balance;
- wipe/season policy;
- staff structure and escalation path.

These are community/product decisions and do not depend on GTA VI APIs.

## 2. Player lifecycle

```text
account
  -> access / whitelist
  -> character creation
  -> first spawn / onboarding
  -> identity + starter state
  -> jobs / social progression
  -> assets + reputation + records
  -> retirement / deletion / archival
```

Plan for:

- multiple character slots only if the community rules justify them;
- character-level ownership rather than account-level shortcuts where RP consistency matters;
- explicit deletion/retirement rules;
- staff-visible audit history for sensitive state changes.

## 3. Core roleplay systems

### Identity

- legal name and date-of-birth model;
- documents and licenses;
- phone number and contact identity;
- employment and faction memberships;
- criminal/justice records;
- character metadata required by RP rules.

### Economy

- cash and bank accounts;
- immutable transaction ledger;
- salaries and business income;
- fines, invoices and taxes if used;
- money sinks and inflation controls;
- staff economy tools with full audit logging.

### Inventory and ownership

- item definitions;
- containers;
- weight/capacity policy;
- metadata, serials and durability where useful;
- ownership transfer rules;
- evidence/contraband semantics;
- lost/destroyed/recovered state transitions.

### Jobs and businesses

- public/civilian jobs;
- player-owned businesses;
- roles and grades;
- payroll;
- permissions;
- stock/storage;
- invoices and accounting;
- hiring/firing history.

### Factions and organizations

- membership and hierarchy;
- shared permissions/assets;
- organization accounts;
- internal audit trail;
- legal/illegal organization distinctions only if required by the server design.

### Police / justice

- dispatch concepts;
- incident/case records;
- warrants;
- fines/citations;
- arrests and custody;
- evidence chain-of-custody;
- licenses and suspensions;
- staff/admin separation from in-character police authority.

### EMS

- dispatch concepts;
- treatment workflow;
- hospital/clinic interactions;
- persistent medical RP records only if the community wants them;
- revive/death consequences to be defined independently from engine-specific health natives.

### Vehicles

- ownership;
- keys/access;
- garage/storage state;
- registration;
- insurance/impound if used;
- business/faction vehicles;
- canonical server state independent from game entity lifetime.

### Properties

- ownership/rental;
- keys/access lists;
- storage;
- business/property linkage;
- persistence independent from whether the future runtime exposes interiors in a FiveM-like way.

### Communications

- phone identity;
- contacts/messages/calls at the domain level;
- emergency service dispatch integration;
- optional social applications later;
- actual in-game phone UI/runtime integration deferred.

## 4. Administration and moderation

A professional RP server needs operational systems from day one:

- role-based staff permissions;
- immutable staff action logs;
- player notes and sanctions;
- ban/allowlist history;
- economy corrections as compensating transactions;
- item/vehicle/property grants with reason and actor;
- support ticket linkage if external tooling is later used;
- separation between in-character authority and out-of-character staff authority.

## 5. Security model

Every client-originated action is untrusted.

Examples:

```text
BAD
client -> setMoney(500000)

GOOD
client -> requestPurchase(vehicleId)
server -> authenticate
server -> authorize
server -> validate catalog + price + funds
server -> transact
server -> persist ownership
server -> emit audit event
server -> return result
```

The same rule applies to inventory, jobs, permissions, properties, vehicles and other valuable state.

## 6. Persistence categories

### Canonical / durable

- accounts and characters;
- economy ledger;
- ownership;
- inventory;
- memberships and permissions;
- police/justice records;
- moderation/audit records;
- configuration that changes server behavior.

### Ephemeral

- current connection/session;
- transient entity handles;
- caches;
- short-lived presence;
- temporary locks/rate limits.

The future GTA VI runtime may own transient game entities, but it should not be the sole source of truth for durable RP state.

## 7. Internal tools

Potential internal tools, not a public website product:

- staff/admin console;
- economy audit viewer;
- character lookup;
- ownership lookup;
- moderation history;
- server configuration editor;
- migration/maintenance tooling;
- observability dashboards.

Whether these are browser-based, in-game or hybrid is an implementation choice that can remain independent from GTA VI until integration time.

## 8. Runtime-dependent requirements register

These must stay abstract until GTA VI documentation exists:

| Requirement        | Domain can be prepared now |             Runtime binding blocked |
| ------------------ | -------------------------: | ----------------------------------: |
| character identity |                        yes |           spawn/model customization |
| inventory rules    |                        yes | in-world item/entity representation |
| economy            |                        yes |           game UI/interaction hooks |
| jobs/factions      |                        yes |       world interactions/NPCs/zones |
| vehicles           |        ownership model yes |        spawning, keys, damage, sync |
| properties         |           access model yes |           interiors/doors/streaming |
| police/EMS         |              workflows yes |       dispatch/world/gameplay hooks |
| phone/comms        |              contracts yes |     game phone UI/voice integration |
| moderation         |      permissions/audit yes |     runtime kick/ban/spectate hooks |

## 9. Definition of readiness

The project is considered **server-design ready** before GTA VI runtime support when:

- the community/server rules are documented;
- core domain invariants have tests;
- the database model is migration-driven;
- security boundaries are explicit;
- staff actions are auditable;
- the simulator can exercise representative RP workflows;
- every GTA VI-specific dependency is listed as a requirement instead of guessed;
- integration can begin by implementing an adapter rather than rewriting the core.
