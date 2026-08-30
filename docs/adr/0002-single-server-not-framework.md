# ADR 0002 — Single-server product, not a generic RP framework

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

The repository name contains `platform`, and the initial technical foundation was broad enough that it could be interpreted as an attempt to build a reusable GTA RP framework or a FiveM-style platform before GTA VI community-server technology is known.

That is not the product goal.

The intended outcome is to prepare and eventually operate **our own GTA VI roleplay server/community**, using professional engineering practices while avoiding speculative runtime work.

## Decision

The project will optimize for one future RP server rather than for third-party framework consumers.

Consequences:

- domain modules may be reusable internally but do not require public extension APIs;
- no compatibility layer for ESX/QBCore/Qbox or similar frameworks is required;
- no plugin marketplace, server browser, hosting platform or public framework distribution model is planned;
- public website development is not a project objective;
- modular-monolith architecture is preferred until real scale demands otherwise;
- infrastructure is added only when our server has a concrete operational requirement;
- FiveM/RedM are research references, not target-product dependencies;
- GTA VI-specific code remains blocked until a legitimate public runtime contract exists.

## Rationale

Optimizing for a generic ecosystem now would force premature abstractions and assumptions about GTA VI that cannot yet be verified. Designing for our own server keeps the repository focused on durable work: rules, authoritative domain behavior, persistence, security, operations and future adapter boundaries.

## Revisit when

Reconsider this decision only if there is a concrete future reason to distribute a reusable component publicly. Such reuse should be extracted from proven server code rather than designed speculatively in advance.
