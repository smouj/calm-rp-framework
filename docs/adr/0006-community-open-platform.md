# ADR-0006: Open community RP platform scope

- **Status:** Accepted
- **Date:** 2026-11-23
- **Supersedes:** The single-server product scope in ADR-0002 and the audience context in ADR-0003; retains ADR-0003's modular-monolith architecture decision

## Context

The repository was originally a private blueprint for one future RP server. Its maintainer now wants an open-source community-led platform with a long-term ambition similar in _scope_ to FiveM, but with GTA VI as a conditional target.

That is a product and governance decision, **not** evidence that GTA VI modding, third-party networking or custom servers are authorized or technically supported.

## Decision

- Invite contributions to reusable, game-independent RP systems and tooling.
- Keep stable domain rules server-authoritative and independent from any game runtime.
- Use the simulator to validate gameplay contracts before making integration commitments.
- Introduce shared extension interfaces only when actual, tested use cases require them.
- Preserve the existing modular-monolith and PostgreSQL-first direction until scale measurements justify complexity.
- Keep the GTA VI adapter blocked until implementable, legitimate public documentation exists.

## Consequences

Open contribution requires a code license, clear roles, security reporting, release discipline, a public backlog and review criteria. Contributors can improve simulation, domains and documentation now; plugin marketplaces, network runtimes and playable game clients are deferred.

An accessible repository and a technically possible game-file parser do not grant rights to GTA VI, its assets or services.

## Transition gates

1. Update readmes, scope, branding, contributor policy and documentation.
2. Verify code and third-party licensing; perform a full repository-history and Actions-log exposure audit.
3. Configure GitHub settings, topics, branch protection, issue labels, discussions and visibility.
4. Ensure CI is executing successfully on the actual branch head before publishing a release.
5. Document any future GTA VI runtime contract through `PLATFORM_STATUS.md`, `RT-*` requirements, an ADR and conformance tests.

**No existing `RT-*` requirement or GTA VI adapter is unlocked by this decision.**
