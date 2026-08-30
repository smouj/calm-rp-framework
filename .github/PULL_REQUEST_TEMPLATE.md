## Purpose

State the problem this change solves and why it belongs in our future GTA VI RP server.

## Scope

- [ ] The change is focused on one concern
- [ ] It serves our own server/community rather than a generic framework use case
- [ ] Any GTA VI-specific dependency is backed by a public first-party source
- [ ] Unknown runtime behavior is documented instead of guessed

## Architecture

- [ ] Domain packages remain independent from game/runtime-specific APIs
- [ ] Server authority remains intact for persistent or valuable state
- [ ] Cross-module contract changes are explicit
- [ ] Persistence changes include a forward migration
- [ ] Operational complexity added by this change is justified

## Security and abuse cases

Describe new player-controlled input, permissions, trust boundaries, economic impact, moderation impact, or abuse paths. Write `None` only when the change cannot affect them.

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm format:check`
- [ ] Relevant simulator or migration checks were added when needed

## Evidence

For platform/runtime research or GTA VI integration work, list the public first-party sources and the classification used in `docs/research/PLATFORM_STATUS.md`. Otherwise write `Not applicable`.

## Follow-up

List intentionally deferred work, blocked runtime requirements, or `None`.
