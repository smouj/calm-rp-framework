# Server Domain Catalog

**State:** ACTIVE

This catalog defines the initial candidate responsibility boundaries for reusable RP domain systems.

It is a planning and architecture reference, not a commitment to one package or service per domain. The default deployment model remains the modular monolith defined by ADR-0003.

## Accounts and sessions

Owns:

- account identity internal to the server;
- access/allowlist state;
- authenticated session lifecycle;
- mapping between an authenticated runtime player and server account when a verified runtime exists.

Core invariants:

- one active runtime session cannot silently impersonate another account;
- runtime identifiers are inputs to identity resolution, not durable player state by themselves;
- bans/access decisions are server-authoritative.

Runtime dependency: authentication/identifier and connection lifecycle contracts remain blocked.

## Characters and identity

Owns:

- character identity and lifecycle;
- character slots if the server design enables them;
- legal identity fields and RP metadata;
- retirement/deletion/archive state;
- character-linked licenses and identity documents where appropriate.

Core invariants:

- durable ownership is character-scoped where RP consistency requires it;
- character deletion/retirement follows explicit policy;
- sensitive staff corrections are auditable.

Runtime dependency: model/customization/spawn projection remains blocked.

## Character progression

Detailed design boundary: [Character Progression](./CHARACTER_PROGRESSION.md).

Owns, only when enabled by community rules:

- server-defined competencies, training and progression history;
- versioned attribute definitions and progression rules;
- idempotent records of activities or awards that change progression.

Core invariants:

- clients never submit authoritative stat values or progression awards;
- definitions specify units, allowed ranges, version and change source;
- long-term progression is separate from temporary health/injury and optional needs;
- changes with gameplay or economic impact are auditable and replay-safe.

Runtime dependency: mapping progression to GTA VI character stats remains `UNKNOWN`; no numerical schema or authorized read/write interface is assumed.

## Economy and ledger

Owns:

- cash and bank balances;
- accounts/wallets;
- immutable financial ledger entries;
- salaries, invoices, fines, fees and other server-defined monetary flows;
- compensating corrections.

Core invariants:

- money cannot be created by a client-provided balance;
- monetary values use integer minor units;
- retryable grants and charges are idempotent;
- corrections preserve audit history.

Runtime dependency: UI and interaction hooks only; financial authority does not depend on the game runtime.

## Inventory and items

Owns:

- item definitions relevant to authoritative gameplay;
- containers and capacity rules;
- quantities and serialized item identity;
- item metadata, durability and evidence semantics where enabled;
- authoritative transfers and destruction/recovery transitions.

Core invariants:

- quantities cannot become negative;
- unique items cannot have multiple canonical owners;
- transfers validate source ownership and destination constraints atomically;
- client inventory displays are projections, not authority.

Runtime dependency: in-world representation and interaction remain adapter concerns.

## Jobs and businesses

Owns:

- civilian/public jobs;
- player-owned businesses;
- employment membership;
- roles/grades within a business or job;
- payroll rules;
- business accounting and stock contracts where enabled.

Core invariants:

- hiring/firing and grade changes require authorized actors;
- payroll cannot bypass economy invariants;
- business permissions are explicit and auditable when they affect valuable state.

Runtime dependency: world zones, NPCs and interaction surfaces remain blocked.

## Factions and organizations

Owns:

- organization identity;
- memberships and hierarchy;
- shared permissions and assets;
- organization accounts where enabled;
- organization-level audit history.

Core invariants:

- membership and rank are server-authoritative;
- shared asset access follows explicit role/capability rules;
- organization money still uses the central economy ledger.

Runtime dependency: world representation remains adapter-specific.

## Vehicles and garages

Owns:

- durable vehicle ownership;
- registration and access/key grants;
- garage/storage state;
- impound/insurance semantics if enabled;
- business/faction vehicle assignment.

Core invariants:

- a transient game entity is not the vehicle ownership record;
- spawn/despawn cannot mint or destroy durable ownership accidentally;
- key/access changes are authorized server-side.

Runtime dependency: entity spawn, ownership, damage and synchronization remain blocked.

## Properties and access

Owns:

- ownership/rental state;
- access grants/keys;
- property-linked storage contracts;
- business/property relationships.

Core invariants:

- runtime interior availability does not define durable ownership;
- access changes require an authorized owner/role/use case;
- storage remains subject to inventory authority.

Runtime dependency: interiors, doors, instancing and streaming remain blocked.

## Police and justice

Owns:

- incidents/cases;
- warrants;
- citations/fines;
- arrest/custody records;
- evidence chain-of-custody;
- license suspension/revocation where part of server design.

Core invariants:

- in-character police authority is distinct from staff authority;
- evidence ownership/history cannot be silently rewritten;
- financial penalties flow through the economy domain.

Runtime dependency: dispatch/world hooks remain adapter-specific.

## EMS and medical RP

Owns:

- RP treatment workflow;
- hospital/clinic records if the community chooses persistence;
- server-defined death/injury consequences;
- EMS role workflows.

Core invariants:

- persistent medical records are collected only if the server design needs them;
- revive/death policy is a server rule, not whatever a client reports;
- sensitive records follow the project's data-handling policy.

Runtime dependency: health state and revive/gameplay hooks remain blocked.

## Communications

Owns:

- persistent phone identity;
- contacts and messages if enabled;
- server-level call/dispatch concepts;
- emergency communication routing contracts.

Core invariants:

- phone identity maps to a server character/account according to explicit policy;
- message/call persistence is independent from any future GTA VI phone UI;
- voice transport does not become the durable source of communication identity.

Runtime dependency: UI, voice and runtime phone integration remain blocked.

## Moderation and staff permissions

Owns:

- staff roles and capabilities;
- sanctions and player notes;
- staff action audit records;
- administrative grants/corrections through domain-safe commands;
- support/escalation state if later implemented.

Core invariants:

- staff capability is separate from in-character faction/job authority;
- privileged actions identify actor, target, reason and correlation context;
- staff tools do not bypass domain invariants through direct persistence edits.

Runtime dependency: kick/ban/spectate and other runtime actions remain blocked until verified.

## Configuration and audit

Owns:

- server-owned configuration that changes authoritative behavior;
- configuration revisions when changes need traceability;
- cross-domain audit correlation standards;
- operationally important immutable event records where appropriate.

Core invariants:

- secrets are not stored as normal gameplay configuration;
- high-impact configuration changes are attributable;
- audit data cannot be treated as a mutable convenience log.

Runtime dependency: none for the domain model; runtime-specific config remains in adapters.

## Spatial planning (synthetic, in-memory prototype)

A project-owned, read-only [world-planning catalog](./WORLD_SPATIAL_READINESS.md) models fictional location IDs, spatial bounds and independent interior/exterior coordinate spaces. This is not a GTA VI map, navigation API, real-world location database or property-ownership authority. Business, EMS, property, security and admin actions remain separately authorized domain use cases. [ADR-0005](../adr/0005-independent-world-planning.md) is proposed for review.

## Boundary rule

A domain may reference another domain through an explicit contract or application use case. It must not reach into another domain's private tables or repository implementation.

If two domains repeatedly need to mutate one another's internals, revisit the boundary before adding more coupling.

See `docs/architecture/BOUNDARIES.md` for the dependency rules and `docs/server/RUNTIME_REQUIREMENTS.md` for blocked runtime capabilities.
