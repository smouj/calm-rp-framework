# Roadmap

This roadmap prepares **our future GTA VI RP server** without pretending the GTA VI server/runtime contract already exists.

No calendar commitment is attached to GTA VI integration phases until Rockstar Games and/or Cfx.re publish the required information.

## P0 — Repository and research discipline

**Goal:** keep the project technically clean and factually honest.

- monorepo, lint/typecheck/test gates;
- project scope and explicit non-goals;
- architecture decision records;
- threat model;
- platform-status register with first-party sources;
- reserved simulator/Cfx/GTA VI adapter boundaries;
- reproducible local PostgreSQL/Redis tooling where needed.

**Exit:** the repository can distinguish confirmed facts, inferences and unknown GTA VI requirements, and CI protects the baseline.

## P1 — Server product specification

**Goal:** define what our server should actually be before implementing large systems.

- community/server identity;
- RP style and access model;
- character lifecycle;
- economy philosophy;
- job/business/faction model;
- police/EMS/justice workflows;
- vehicle/property ownership rules;
- staff roles and moderation model;
- wipe/season/progression policy;
- list of runtime-dependent requirements.

**Exit:** `SERVER_BLUEPRINT.md` and follow-up design documents are specific enough to drive implementation without requiring GTA VI APIs.

## P2 — Game-independent vertical slices

**Goal:** implement only domain behavior that is very likely to survive any future runtime choice.

Recommended first slices:

1. account/session boundary;
2. character identity lifecycle;
3. ledger-based wallet/bank transfers;
4. basic inventory/container ownership;
5. permissions and immutable audit events;
6. deterministic simulator workflows;
7. fictional RP location planning across separate coordinate spaces, without relying on game assets or navigation assumptions.

**Exit:** two simulated players can execute representative RP actions through authoritative commands with persistence and auditability, without importing game-specific code.

## P3 — Server systems by validated need

**Goal:** expand the server model only after the P1 product decisions exist.

Candidate modules:

- jobs and businesses;
- factions and memberships;
- vehicles and garages;
- properties and access;
- police/justice;
- EMS;
- communications/phone contracts;
- moderation/admin tooling.

Do not build every possible RP feature simply because existing FiveM frameworks contain it.

**Exit:** each implemented module has documented invariants, tests, migrations and a clear reason to exist in our planned server.

## P4 — Cfx compatibility/research lab

**Goal:** study current public Cfx.re integration patterns without turning them into GTA VI assumptions.

Possible work:

- adapter experiments using public FiveM/RedM APIs;
- client/server trust-boundary exercises;
- resource lifecycle research;
- NUI/web-view patterns;
- entity synchronization/ownership research;
- security failure-mode studies.

**Constraint:** nothing learned here may become a GTA VI requirement without separate first-party GTA VI confirmation.

## P5 — GTA VI integration discovery

**Status:** BLOCKED by public platform information.

Unlock only when a legitimate GTA VI community-server/runtime path is documented.

Then:

1. update `docs/research/PLATFORM_STATUS.md`;
2. capture supported runtimes, hosting model and platform policy;
3. enumerate capability gaps against our server blueprint;
4. write ADRs for each major integration decision;
5. define adapter conformance tests;
6. build the smallest end-to-end GTA VI proof of concept;
7. benchmark synchronization, latency, authority and persistence boundaries.

**Exit:** one authenticated player can connect through the legitimate runtime and exercise a small authoritative RP vertical slice end-to-end.

## P6 — Private server prototype

**Goal:** assemble a playable private prototype of our own RP server.

- character onboarding;
- persistence;
- economy/inventory baseline;
- one civilian gameplay loop;
- one emergency-service workflow;
- vehicles/properties only to the extent the runtime supports them;
- staff/moderation tools;
- observability and backups;
- security review.

**Exit:** a small invited test group can play repeatable sessions without manual database intervention for normal flows.

## P7 — Community readiness

**Goal:** prepare operation of the actual community rather than merely shipping code.

- rules and onboarding;
- whitelist/access workflow if used;
- staff training and permissions;
- incident/moderation procedures;
- backups and disaster recovery drills;
- economy monitoring;
- release/change-management process;
- performance/load testing based on real runtime limits;
- policy/legal review against current Rockstar/Cfx.re rules.

**Exit:** the server can be operated predictably, audited and recovered.

## Always blocked from speculative implementation

Until first-party public documentation exists, do not implement fake GTA VI versions of:

- natives;
- entity APIs;
- event names;
- resource manifests;
- authentication identifiers;
- voice APIs;
- NUI/web-view APIs;
- server binaries;
- anti-cheat hooks;
- asset-streaming contracts.

Track those as requirements, not code.
