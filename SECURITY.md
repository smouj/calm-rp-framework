# Security Policy

This is a community-oriented open-source **research and prototype** project. There is no playable GTA VI multiplayer server or client distributed here.

## Report vulnerabilities privately

**Do not open a public issue or discussion containing a vulnerability or working exploit.**

Use [GitHub private vulnerability reporting](https://github.com/smouj/gta6-rp-platform/security/advisories/new) **if enabled by the repository owner**. If the private reporting form is unavailable, contact a project maintainer through a private GitHub communication channel and request a secure way to share a minimal reproduction. Do not disclose secrets or exploit payloads publicly.

Include the affected commit, impact, reproducible steps using synthetic data and any safe suggested fix. Maintainers will assess the issue, coordinate a fix and publish a security advisory if warranted. **No response-time or disclosure-date guarantee is currently offered.**

For suspected compromise of a Rockstar account or official service, contact Rockstar support; this project does not operate those services.

## Supported versions

| Version | Security support |
| --- | --- |
| Current `main` development branch | Best-effort review; not production-supported |
| Older branches, forks, unreleased experiments | No support commitment |
| GTA VI game client/server | **Not distributed or supported** |

## Security invariants

- Every client-controlled input is untrusted; authenticating a request is not authorizing a state change.
- Money, inventory, staff permissions, identity and ownership are changed only through server-side validated commands.
- Use atomic transactions for valuable state and immutable or compensating audit records.
- Keep production secrets and personal data out of Git, logs, issue attachments and test fixtures.
- Keep CI permissions limited, dependencies pinned/reviewed and caches non-authoritative.
- Apply rate limits and resource limits to exposed interfaces as they become real.
- Separate in-character RP authority from platform/admin privileges.
- GTA VI integration cannot rely on private services, leaked code, unauthorized authentication, a speculative client or protected game data.

## Public-repository safeguards

Before making an existing private repository public, audit **all commits, branches, closed/open PR attachments, workflow runs and logs**, because publishing can expose past data even if the latest files appear clean. Rotate any secrets found and remove them from the relevant history or publish a clean repository instead.

See [public launch checklist](./docs/community/PUBLIC_LAUNCH_CHECKLIST.md) and [threat model](./docs/security/THREAT_MODEL.md). Publication itself does not imply that the project passed a security audit.
