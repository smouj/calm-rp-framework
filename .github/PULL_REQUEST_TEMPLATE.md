## Purpose

Link the issue or describe the contributor/user problem and the tested outcome.

## Scope and maturity

- [ ] This change is bounded and useful for the open RP platform or its simulator
- [ ] The PR distinguishes implemented, prototype, research, proposed and blocked work
- [ ] No unsupported GTA VI API, multiplayer capability or authorization is claimed
- [ ] No game binaries, extracted assets, leaks, secrets or protected data are included

## Engineering and review

- [ ] Game-specific APIs stay outside portable domain code
- [ ] Security-sensitive state remains server-authoritative
- [ ] Contract changes and persistence migrations are documented and tested where applicable
- [ ] New dependencies have a licensing/security rationale
- [ ] Changes to architecture, licensing, platform policy or security have human review

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm format:check`
- [ ] Relevant conformance, simulator or migration tests added if necessary

Record the actual command outcomes. Do not mark CI green if GitHub never assigned a runner.

## Evidence and attribution

For platform/runtime research include publisher, URL, publication date, verification date, exact confirmed scope and unknowns. Otherwise write `Not applicable`.

Confirm contributed material can be licensed under the project MIT license, and identify third-party sources where needed.

## Follow-up

Deferred work, intentionally unresolved questions, blocked GTA VI requirements or `None`.
