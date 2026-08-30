# Project Scope

## Product definition

This repository prepares the design and technical foundation for **one private GTA VI roleplay server/community** that we may operate in the future if Rockstar Games provides, or authorizes through Cfx.re or another official/public path, the required community-server/runtime capabilities.

The repository is intentionally useful before that runtime exists.

## What success looks like

When a legitimate GTA VI server/runtime integration becomes available, we should already have:

- a documented RP server vision;
- clear gameplay and administration rules;
- stable domain contracts for core server systems;
- a persistence model with migrations and auditability;
- a server-authoritative security model;
- deterministic tests/simulation for game-independent behavior;
- operational requirements for backups, logs and moderation;
- a precise list of GTA VI capabilities still needed from the runtime;
- a clean adapter boundary where the real game integration can be implemented.

The desired outcome is **faster, safer server implementation**, not a generic ecosystem product.

## In scope now

### Server design

- onboarding and character lifecycle
- identity and documents
- economy and banking
- inventory and ownership
- jobs and progression
- factions and organizations
- player-owned businesses
- vehicles and garages
- properties and access control
- police and justice workflows
- EMS workflows
- communications / phone concepts
- permissions and staff roles
- moderation and audit trails
- server rules and governance

### Technical preparation

- game-agnostic domain contracts
- simulator and test harnesses
- database schemas and migrations
- threat modelling and abuse-case design
- logging and observability requirements
- backup/restore strategy
- development tooling and CI
- prototypes for internal/admin or in-game web UI where they do not depend on undocumented game APIs

### Research

- official Rockstar GTA VI platform announcements
- official Rockstar RP/community-server policy
- official Cfx.re announcements and public runtime documentation
- current FiveM/RedM patterns only as comparative research
- future GTA VI PC/runtime/community-server documentation when published

## Deferred until public information exists

The following stay blocked until legitimate documentation or tooling is available:

- GTA VI player/entity APIs
- GTA VI networking/event APIs
- GTA VI server binaries or hosting model
- GTA VI scripting runtimes and supported languages
- GTA VI resource manifests
- GTA VI synchronization/ownership semantics
- GTA VI NUI/web-view integration
- GTA VI voice integration
- GTA VI asset streaming/modding contracts
- GTA VI anti-cheat integration
- GTA VI identifiers/authentication contracts
- GTA VI native functions

A FiveM equivalent must never be assumed merely because FiveM exists for GTA V.

## Explicitly out of scope

- creating a FiveM replacement
- creating a public framework such as ESX/QBCore/Qbox
- creating a server hosting marketplace
- creating a public GTA VI RP directory
- building a dedicated public website as the product
- reverse engineering private Rockstar services
- using leaked GTA VI code, assets, APIs or documentation
- redistributing proprietary Rockstar assets
- inventing compatibility claims for GTA VI

## Design guardrails

1. **Unknown means unknown.** Do not encode speculation as an API contract.
2. **One server is the product.** Generic framework features require a concrete benefit to our server.
3. **Server authority is mandatory.** Client input is never canonical state.
4. **Modular monolith first.** Distribution is an optimization, not a starting point.
5. **Game integration is replaceable.** Domain behavior survives adapter changes.
6. **Operational simplicity matters.** Prefer systems we can actually run, audit and recover.
7. **Research has provenance.** Material platform claims must point to an official/public source.

## Decision test for new work

Before adding a feature, ask:

1. Does this help us design or operate our future RP server?
2. Can it be built without inventing GTA VI behavior?
3. Is it better represented as documentation/simulation until the runtime exists?
4. Does it introduce infrastructure complexity without a current requirement?
5. Would this still be useful if GTA VI's server model differs from FiveM?

If the answer reveals a GTA VI-specific dependency that is still unknown, document the requirement instead of implementing a fake adapter.
