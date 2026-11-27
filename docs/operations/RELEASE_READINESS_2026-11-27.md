# CALM release readiness — 27 November 2026

**Project:** CALM Essentials, an independent GTA VI-first roleplay project
**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework)  
**Purpose:** current technical and publication status; this is not legal advice or a live CI badge.

## Current status

| Gate                       | Status                                            | Evidence and limits                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product scope              | **DEFINED**                                       | [ADR-0009](../adr/0009-gta-vi-first-product-scope.md) makes GTA VI the explicit product target. CALM defines original RP domains; ESX/QB/FiveM are not architecture or compatibility targets.                                                                                                                                                                                                                          |
| F1 persistence             | **CORE DELIVERED; FOLLOW-UP OPEN**                | PostgreSQL accounts, characters, sessions and double-entry ledger are merged in [PR #57](https://github.com/smouj/calm-rp-framework/pull/57). The broader F1 issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) remains open for API/transport wiring, privileged-grant audit, limits and failure/threat-model coverage.                                                                                |
| F2 inventory               | **IMPLEMENTED IN PR #59; EXACT-HEAD CI REQUIRED** | The candidate adds the authenticated transactional service/repository, synthetic simulator flow, capacity/rollback checks and embedded close/reopen receipt recovery. CI run #224 passed on head `dcf6662`, including the live PostgreSQL 17 suite; any later PR head must pass the same gate before merge. Close issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) after merge and acceptance review. |
| GTA VI integration         | **BLOCKED**                                       | No authorized, verified GTA VI runtime or community-server API is established; no playable client, mod or server is claimed.                                                                                                                                                                                                                                                                                           |
| Current-candidate checks   | **LOCAL GATES PASSED; CI REQUIRED PER HEAD**      | `pnpm check`, build, artifact, secret and site-integrity gates pass on the current working tree. Vitest reports 140 passed and 8 skipped across 20 files; the skipped live cases require PostgreSQL. Hosted CI run #224 passed on the earlier head `dcf6662`, including PostgreSQL 17; the final PR head must pass again after these changes are pushed.                                                               |
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

CI run #224 completed successfully on PR head `dcf6662`, including its PostgreSQL 17 job. Any new
PR head still requires its own successful run.

The CALM site now contains product-focused evidence and no PC compatibility diagram. The animated
compatibility SVG is maintained only in the independent documentary repository; it is not a CALM
site asset, architecture input or runtime dependency.

## Remaining publication work

- Merge PR #59 only after the exact PR head passes hosted PostgreSQL 17 and every F2 acceptance item is satisfied; close issue #54 after the merge.
- Keep F1 issue #32 open for its remaining transport/API wiring, attributable privileged-grant audit, rate limits, failure coverage and threat-model review.
- Complete the repository-owner security settings and historical/attachment/log review tracked in
  [issue #2](https://github.com/smouj/calm-rp-framework/issues/2). The automated path scanners are
  not a substitute for that audit.
- Keep the GTA VI adapter disabled until first-party authorization and callable runtime contracts
  are verifiable.
