# ADR-0001: Game-agnostic core with platform adapters

- Status: Product positioning superseded by [ADR-0009](./0009-gta-vi-first-product-scope.md); testability and separation safeguards retained
- Date: 2026-08-30

## Context

The eventual GTA VI community-server/runtime contract is not public. Building domain systems directly against GTA V/FiveM natives would create unnecessary migration risk.

## Decision

All durable RP business rules live in game-agnostic TypeScript packages. Runtime-specific behavior is implemented behind adapters. Cfx.re experimentation and future GTA VI integration remain separate boundaries.

> **Historical scope note (2026-11-27):** CALM's product target is now GTA VI RP, not a reusable game-agnostic framework. The separation and testability principles in this ADR remain useful implementation techniques; see ADR-0009 for the current target and runtime gate.

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
