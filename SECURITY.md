# Security Policy

This repository is private during the pre-platform phase.

## Reporting

Do not open a public issue for a vulnerability. Report security findings privately to the repository owner with reproduction steps, impact and affected revision.

## Baseline security requirements

- Treat all client input as hostile.
- Authenticate and authorize every privileged command server-side.
- Use parameterized database operations.
- Never trust client-reported balances, items, ranks, identifiers or ownership.
- Keep secrets outside the repository.
- Apply least privilege to database and service credentials.
- Record auditable security-relevant domain events.
- Rate-limit abuse-prone commands at transport boundaries.

See `docs/security/THREAT_MODEL.md`.
