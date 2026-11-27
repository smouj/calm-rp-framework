# CALM release readiness — 27 November 2026

**Project:** CALM Essentials, an independent GTA VI-first roleplay project
**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework)  
**Purpose:** current technical and publication status; this is not legal advice or a live CI badge.

## Current status

| Gate                       | Status                                            | Evidence and limits                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product scope              | **DEFINED**                                       | [ADR-0009](../adr/0009-gta-vi-first-product-scope.md) makes GTA VI the explicit product target. CALM defines original RP domains; ESX/QB/FiveM are not architecture or compatibility targets.                                                                                                                                                                                                                          |
| F1 identity and economy    | **LOCAL IMPLEMENTATION COMPLETE; PR/CI PENDING**  | Foundation is merged in [PR #57](https://github.com/smouj/calm-rp-framework/pull/57). The current candidate adds a loopback-only operator API, bounded transport, server-resolved sessions, durable atomic grant auditing, and lost-response/failure coverage. Issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) remains open until review and exact-head hosted CI pass and the change is merged.                                                |
| F2 inventory               | **MERGED AND ACCEPTED**                           | The authenticated transactional service/repository, synthetic simulator flow, capacity/rollback checks and embedded close/reopen receipt recovery were merged in [PR #59](https://github.com/smouj/calm-rp-framework/pull/59). Its exact-head CI run #224 passed with the live PostgreSQL 17 suite; issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) is closed as completed.                   |
| GTA VI integration         | **BLOCKED**                                       | No authorized, verified GTA VI runtime or community-server API is established; no playable client, mod or server is claimed.                                                                                                                                                                                                                                                                                           |
| Current-candidate checks   | **LOCAL GATES PASSED; CI REQUIRED PER HEAD**      | `pnpm check`, build, artifact, secret and site-integrity gates pass on the current working tree. Vitest reports 150 passed and 8 skipped across 21 files; the skipped live cases require PostgreSQL. CI run #224 belongs to the earlier, already merged F2 candidate; the F1 closeout must pass on its own exact PR head.                                                                                                  |
| Hosted PR CI               | **REQUIRED PER CHANGE**                           | CI runs unit/integration checks and PostgreSQL 17 on each PR head. Merge only after that exact final-head run succeeds.                                                                                                                                                                                                                                                                                                |
| Third-party artifacts      | **GUARDED, NOT CLEARED**                          | Path and secret checks are partial controls; they do not scan ignored files, file contents, the entire history, PR attachments or every Actions log.                                                                                                                                                                                                                                                                   |
| Legal and trademark review | **PRELIMINARY**                                   | See the interoperability/IP review. Source publication does not establish game integration rights.                                                                                                                                                                                                                                                                                                                     |
| Production operations      | **NOT READY**                                     | No deployed service, public game transport, production runbook or authorized adapter is provided by this repository.                                                                                                                                                                                                                                                                                                   |

## Verified local checks

Reproduce the local verification with:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm check:artifacts
pnpm check:secrets
pnpm check:site
```

The current working tree passed `pnpm check`, `pnpm build`, `pnpm check:artifacts`,
`pnpm check:secrets` and `pnpm check:site`. `pnpm check` completed lint, typecheck, tests and
formatting; Vitest reported **19 files passed, 1 skipped; 140 tests passed, 8 skipped (148
total)**. The skipped cases are the live PostgreSQL suite: `DATABASE_URL` is unset, and
Docker/`psql` are not installed in this environment. Embedded PostgreSQL checks passed. This does
not count as a real PostgreSQL result; hosted CI must run the live multi-connection suite on the
exact PR head.

F2 CI run #224 completed successfully on PR head `dcf6662`, including its PostgreSQL 17 job. The
current F1 closeout is not yet a pull request and has no hosted result; its exact PR head must pass
the same checks, including the live PostgreSQL 17 job.

The CALM GitHub Pages site is published. Its original Leonida-inspired SVG is decorative site
artwork, not an in-game capture or evidence of runtime support. The technical atlas and its evidence
matrix remain independent documentary research; they are not CALM runtime inputs or GTA VI API
contracts.

## Remaining publication work

- Open and review the F1 closeout PR; merge only after its exact head passes hosted PostgreSQL 17 and every issue #32 acceptance item is satisfied.
- Keep F1 issue #32 open until that PR is merged and its acceptance evidence is recorded.
- Complete the repository-owner security settings and historical/attachment/log review tracked in
  [issue #2](https://github.com/smouj/calm-rp-framework/issues/2). The automated path scanners are
  not a substitute for that audit.
- Keep the GTA VI adapter disabled until first-party authorization and callable runtime contracts
  are verifiable.
