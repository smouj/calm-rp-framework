# ADR-0003: Modular monolith first

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

The project is preparing one future RP server, not a generic hosted platform. The eventual GTA VI runtime model, hosting requirements, player limits and synchronization constraints are not yet public.

Splitting the system into microservices before those requirements exist would add deployment, networking, observability, consistency and failure-mode complexity without solving a demonstrated problem.

## Decision

The authoritative server application starts as a modular monolith.

Modules keep explicit domain boundaries, contracts and persistence ownership, but are composed into the smallest practical number of deployable processes.

A new independently deployed service requires a concrete reason such as:

- materially different scaling characteristics;
- isolation of a high-risk or high-cost workload;
- independent availability requirements;
- a platform/runtime constraint that cannot be satisfied cleanly in-process;
- a measured operational bottleneck.

“Future scale” alone is not sufficient justification.

## Consequences

### Positive

- simpler local development and staging;
- fewer distributed failure modes;
- easier transactions across tightly related invariants;
- lower operational cost during the preparation phase;
- domain boundaries can still be extracted later if evidence supports it.

### Cost

- module boundaries must be enforced deliberately rather than by network separation;
- poorly designed modules could become tightly coupled if guardrails are ignored;
- some future runtime constraints may require extraction work.

## Guardrail

Do not introduce a message broker, service mesh, distributed transaction scheme or multi-service deployment solely to imitate large production architectures.

Extraction follows measured requirements and an ADR.
