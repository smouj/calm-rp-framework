# CALM release readiness — 27 November 2026

**Project:** CALM Essentials, an independent GTA VI-first roleplay project
**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework)  
**Purpose:** current technical and publication status; this is not legal advice or a live CI badge.

## Current status

| Gate                       | Status                                    | Evidence and limits                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product scope              | **DEFINED**                               | [ADR-0009](../adr/0009-gta-vi-first-product-scope.md) makes GTA VI the explicit product target. CALM defines original RP domains; ESX/QB/FiveM are not architecture or compatibility targets.                                                                                                                                                               |
| F1 persistence             | **CORE DELIVERED; FOLLOW-UP OPEN**        | PostgreSQL accounts, characters, sessions and double-entry ledger are merged in [PR #57](https://github.com/smouj/calm-rp-framework/pull/57). The broader F1 issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) remains open for API/transport wiring, privileged-grant audit, limits and failure/threat-model coverage.                     |
| F2 inventory               | **CANDIDATE IMPLEMENTED; CI PENDING**     | The current local candidate adds the authenticated transactional service/repository, synthetic simulator flow, capacity/rollback checks and embedded close/reopen receipt recovery. Issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) stays open until every acceptance criterion and the live PostgreSQL 17 run pass on the exact PR head. |
| GTA VI integration         | **BLOCKED**                               | No authorized, verified GTA VI runtime or community-server API is established; no playable client, mod or server is claimed.                                                                                                                                                                                                                                |
| Current-candidate checks   | **LOCAL GATES PASSED; LIVE PG17 PENDING** | Frozen install, `pnpm check`, build, artifact, secret and site-integrity gates pass on this candidate. Vitest reports 140 passed and 8 skipped across 20 files; the skipped tests need a real PostgreSQL service. Docker, `psql` and `DATABASE_URL` are unavailable locally. Hosted PostgreSQL 17 CI remains required.                                      |
| Hosted PR CI               | **REQUIRED PER CHANGE**                   | CI runs unit/integration checks and PostgreSQL 17 on each PR head. Merge only after that exact final-head run succeeds.                                                                                                                                                                                                                                     |
| Third-party artifacts      | **GUARDED, NOT CLEARED**                  | Path and secret checks are partial controls; they do not scan ignored files, file contents, the entire history, PR attachments or every Actions log.                                                                                                                                                                                                        |
| Legal and trademark review | **PRELIMINARY**                           | See the interoperability/IP review. Source publication does not establish game integration rights.                                                                                                                                                                                                                                                          |
| Production operations      | **NOT READY**                             | No deployed service, public game transport, production runbook or authorized adapter is provided by this repository.                                                                                                                                                                                                                                        |

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

The 2026-11-27 candidate passed `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`,
`pnpm check:artifacts`, `pnpm check:secrets` and `pnpm check:site`. `pnpm check` completed lint,
typecheck and formatting; Vitest reported **19 files passed, 1 skipped; 140 tests passed, 8
skipped (148 total)**. The skipped cases are the live PostgreSQL suite: `DATABASE_URL` is unset,
and Docker/`psql` are not installed in this environment. Embedded PostgreSQL checks passed. This
does not count as a real PostgreSQL result; hosted CI must run the live multi-connection suite on
the exact PR head.

The animated SVG was rendered in Microsoft Edge at full-size desktop and 390 px mobile widths;
the layout remained within its cards. Motion uses CSS keyframes, and `prefers-reduced-motion`
disables animation while preserving all content.

## Remaining publication work

- Keep issue #54 open until the exact PR head passes hosted PostgreSQL 17 and every acceptance item is satisfied.
- Keep F1 issue #32 open for its remaining transport/API wiring, attributable privileged-grant audit, rate limits, failure coverage and threat-model review.
- Complete the repository-owner security settings and historical/attachment/log review tracked in
  [issue #2](https://github.com/smouj/calm-rp-framework/issues/2). The automated path scanners are
  not a substitute for that audit.
- Keep the GTA VI adapter disabled until first-party authorization and callable runtime contracts
  are verifiable.
