# Contributing

## Workflow

1. Branch from `main`.
2. Keep changes scoped to one concern.
3. Add or update tests for behavior changes.
4. Run `pnpm check` before opening a PR.
5. Open a PR and complete the template.

## Branch naming

- `feat/<scope>-<summary>`
- `fix/<scope>-<summary>`
- `chore/<summary>`
- `docs/<summary>`
- `security/<summary>`

## Commit convention

Use Conventional Commits, for example:

- `feat(economy): add ledger transfer command`
- `fix(inventory): reject negative quantities`
- `docs(adr): define game adapter boundary`

## Architecture constraints

- Domain packages cannot import game natives or adapter implementation code.
- Clients cannot authoritatively mutate persistent RP state.
- Database changes require migrations.
- New cross-context dependencies require justification in the PR.
- GTA VI-specific assumptions require a public source and must stay inside `adapters/gta6`.

## Secrets

Never commit tokens, credentials, connection strings with production credentials, game assets, dumps containing personal data, or proprietary/leaked materials.
