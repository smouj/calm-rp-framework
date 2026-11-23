# Project Governance

**Status:** Community onboarding policy — review before public release.

## Mission

Maintain an independent open-source RP foundation whose GTA VI integration remains conditional on public, legitimate technical and platform support.

## Roles

- **Contributors** propose issues, documentation, tests, code and design. Anyone may contribute.
- **Reviewers** provide technical feedback; review participation alone does not grant repository permissions.
- **Maintainers** are the trusted people with GitHub write/review permissions. They triage reports, safeguard releases, review architecture and manage access.
- **Repository owner** retains final responsibility for repository settings, licensing decisions, contributor access and compliance.

These roles do not imply affiliation with Rockstar Games, Take-Two, FiveM or Cfx.re.

## Decision process

1. Small bug fixes and documentation corrections: focused PR, appropriate tests and at least one maintainer review.
2. Domain, API, persistence or compatibility changes: issue or design proposal first, with migration and backwards-compatibility assessment.
3. Major architecture, license, trademark, security, monetization or GTA VI runtime claims: human maintainer approval, evidence record and an ADR where necessary.
4. If reviewers disagree, record the alternatives and reasoning publicly without leaking protected information. The owner resolves unresolved governance disputes.

Maintainers should not merge their own high-risk changes without independent review when an independent reviewer is available. Passing CI does not substitute for security, license or policy review.

## Pull request expectations

Use branch-based contributions and Conventional Commits. Tests and formatting must pass on the final head. Avoid automatically merging a PR when GitHub Actions never started its steps or a required review is incomplete.

## Ownership and releases

The MIT license applies to original repository material only. Contributors must have the right to submit their work under that license; do not submit third-party assets or extracted game content.

Release notes must describe verified software functionality, supported environments and limitations. Versioning/compatibility guarantees are introduced only after working artifacts exist. No GTA VI build or installer may be described as ready based on research alone.

## Maintainer changes

Maintainer invitations depend on sustained, trusted contributions, technical judgment and consistent handling of security and community conduct. The repository owner grants and may revoke access.

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md) and [ADR-0006](./docs/adr/0006-community-open-platform.md).
