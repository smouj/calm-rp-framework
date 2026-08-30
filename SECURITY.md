# Security Policy

This repository is private while the GTA VI RP server remains in its preparation and pre-runtime phase.

## Reporting security findings

Do not disclose a vulnerability through a general project issue. Report it privately to the repository owner with:

- affected revision;
- reproduction steps;
- expected and observed impact;
- affected trust boundary or persisted state;
- any safe mitigation already identified.

Avoid attaching credentials, personal data, proprietary game material, or live exploit payloads when a minimal reproduction is sufficient.

## Security baseline

### Client trust

- Treat every client-originated value as untrusted.
- Authenticate and authorize privileged commands on the server.
- Never accept client-reported money, inventory, rank, ownership, permissions, or other canonical RP state as authoritative.
- Validate command preconditions again at the point where durable state is committed.

### Persistence

- Use parameterized database operations.
- Use transactions for state changes that must succeed or fail atomically.
- Keep audit-relevant records immutable where practical; corrections should be explicit compensating actions.
- Keep Redis and other caches non-authoritative.
- Backups must be restorable, not merely created.

### Permissions and operations

- Apply least privilege to database, CI, service, and staff credentials.
- Keep secrets outside the repository and outside committed environment files.
- Record security-relevant staff and domain actions with actor, reason, target, and timestamp where applicable.
- Rate-limit abuse-prone transport operations.
- Separate in-character permissions from out-of-character staff authority.

### Supply chain

- Pin GitHub Actions to reviewed commit SHAs.
- Review dependency upgrades through pull requests and CI.
- Commit and enforce a reviewed lockfile before treating dependency installation as reproducible.
- Do not enable dependency or build scripts merely to silence package-manager warnings; understand why they are required first.

### GTA VI / platform integrity

- Do not use leaked game code, private Rockstar services, stolen credentials, or non-public APIs.
- Do not turn rumors or reverse-engineered private behavior into a trusted runtime contract.
- GTA VI-specific integrations require a legitimate public source and the adapter/ADR process defined by this repository.

## Security review triggers

A focused security review is required when a change introduces or materially changes:

- authentication or player identifiers;
- money, inventory, ownership, or trading;
- staff/admin permissions;
- player-to-player transfers;
- external webhooks or services;
- file uploads or player-controlled content;
- runtime event/RPC boundaries;
- database migrations affecting valuable state;
- moderation, bans, evidence, or audit trails;
- a new GTA VI or Cfx.re integration surface.

See [`docs/security/THREAT_MODEL.md`](./docs/security/THREAT_MODEL.md) for the current threat model.
