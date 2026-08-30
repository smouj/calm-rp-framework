# ADR-0001: Game-agnostic core with platform adapters

- Status: Accepted
- Date: 2026-08-30

## Context

The eventual GTA VI community-server/runtime contract is not public. Building domain systems directly against GTA V/FiveM natives would create unnecessary migration risk.

## Decision

All durable RP business rules live in game-agnostic TypeScript packages. Runtime-specific behavior is implemented behind adapters. Cfx.re experimentation and future GTA VI integration remain separate boundaries.

## Consequences

### Positive

- Domain tests can run without a game client.
- Runtime integration can be replaced without rewriting core RP logic.
- Security-sensitive rules stay server-side and centrally testable.

### Cost

- Adapter interfaces must be designed explicitly.
- Some runtime-specific optimizations may require additional translation layers.

## Guardrail

A domain package importing a GTA/FiveM native or adapter implementation is an architecture violation.
