# CALM release readiness — 27 November 2026

**Project:** CALM Essentials, an independent GTA VI-first roleplay project
**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework)  
**Purpose:** current technical and publication status; this is not legal advice or a live CI badge.

## Current status

| Gate                       | Status                                    | Evidence and limits                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product scope              | **DEFINED**                               | [ADR-0009](../adr/0009-gta-vi-first-product-scope.md) makes GTA VI the explicit product target. CALM defines original RP domains; ESX/QB/FiveM are not architecture or compatibility targets.                                                                                                                                                                                                                               |
| F1 identity and economy    | **MERGED; EXACT-HEAD AND MAIN CI PASSED** | [PR #61](https://github.com/smouj/calm-rp-framework/pull/61) merged as `96195bd`. Its exact-head CI [run #232](https://github.com/smouj/calm-rp-framework/actions/runs/46029698320) and post-merge `main` CI [run #233](https://github.com/smouj/calm-rp-framework/actions/runs/46030055051) passed, including PostgreSQL 17. F1 issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) is closed as completed.  |
| F2 inventory               | **MERGED AND ACCEPTED**                   | The authenticated transactional service/repository, synthetic simulator flow, capacity/rollback checks and embedded close/reopen receipt recovery were merged in [PR #59](https://github.com/smouj/calm-rp-framework/pull/59). Its exact-head CI run #224 passed with the live PostgreSQL 17 suite; issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) is closed as completed.                               |
| GTA VI integration         | **BLOCKED**                               | No authorized, verified GTA VI runtime or community-server API is established; no playable client, mod or server is claimed.                                                                                                                                                                                                                                                                                                |
| Current-candidate checks   | **LOCAL AND HOSTED GATES PASSED**         | `pnpm check`, build, artifact, secret and site-integrity gates pass on the merged working tree. Vitest reports 150 passed and 8 skipped across 21 files; local skips require PostgreSQL and the hosted PR/main CI runs exercised PostgreSQL 17.                                                                                                                                                                             |
| Hosted PR CI               | **REQUIRED PER CHANGE**                   | CI runs unit/integration checks and PostgreSQL 17 on each PR head. Merge only after that exact final-head run succeeds.                                                                                                                                                                                                                                                                                                     |
| Repository protections     | **PARTIAL — OWNER ACTIONS OPEN**          | Read-only settings inspection: `main` requires PRs and resolved conversations, enforces linear history, and blocks admin bypass, force pushes and deletion. It does not require an approval or `CI / validate`. Dependabot alerts/security updates are enabled; private vulnerability reporting and Secret Protection are disabled. Track owner changes in [issue #2](https://github.com/smouj/calm-rp-framework/issues/2). |
| Third-party artifacts      | **GUARDED, NOT CLEARED**                  | Path and secret checks are partial controls; they do not scan ignored files, file contents, the entire history, PR attachments or every Actions log.                                                                                                                                                                                                                                                                        |
| Legal and trademark review | **PRELIMINARY**                           | See the interoperability/IP review. Source publication does not establish game integration rights.                                                                                                                                                                                                                                                                                                                          |
| Production operations      | **NOT READY**                             | No deployed service, public game transport, production runbook or authorized adapter is provided by this repository.                                                                                                                                                                                                                                                                                                        |

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
formatting; Vitest reported **20 files passed, 1 skipped; 150 tests passed, 8 skipped (158
total)**. The skipped cases are the live PostgreSQL suite: `DATABASE_URL` is unset, and
Docker/`psql` are not installed in this environment. Embedded PostgreSQL checks passed. The exact
PR-head and post-merge hosted CI runs passed the live multi-connection suite against PostgreSQL 17.

F2 CI run #224 completed successfully on PR head `dcf6662`, including PostgreSQL 17. F1 PR #61's
exact-head CI run #232 and post-merge `main` run #233 both completed successfully with PostgreSQL 17.
Documentation PR #62's exact-head CI run #234 and post-merge `main` run #235, PR #63's exact-head CI run #236 and post-merge `main` run #237, and PR #64's exact-head CI run #238 and post-merge `main` run #239 all passed, including PostgreSQL 17. PR #65 passed exact-head run [#240](https://github.com/smouj/calm-rp-framework/actions/runs/46038319024) and `main` run [#241](https://github.com/smouj/calm-rp-framework/actions/runs/46038679143); PR #66 passed [#242](https://github.com/smouj/calm-rp-framework/actions/runs/46040940883) and [#243](https://github.com/smouj/calm-rp-framework/actions/runs/46041232409); and the Atlas publication PR #67 passed [#244](https://github.com/smouj/calm-rp-framework/actions/runs/46044674483) and [#245](https://github.com/smouj/calm-rp-framework/actions/runs/46044994137). The six runs all passed, including the live PostgreSQL 17 suite.

The CALM GitHub Pages site is published. Its original Leonida-inspired SVG is decorative site
artwork, not an in-game capture or evidence of runtime support. The technical atlas and its evidence
matrix remain independent documentary research; they are not CALM runtime inputs or GTA VI API
contracts. The Atlas merge's Pages run #21 passed site validation and upload but failed while
retrieving the uploaded artifact. Retrying that same run produced duplicate `github-pages`
artifacts, so a fresh manual dispatch was used instead: Pages run #22 succeeded. On 27 November,
the live site returned HTTP 200 with the Atlas feature, and the linked PDF returned HTTP 200 as an
`application/octet-stream` of 3,107,053 bytes. The earlier run #20 had also succeeded after a retry.

Atlas edition 1.0 is archived separately under `docs/research/atlas/` with its 30-page PDF,
24-chapter Markdown manuscript, 218-record evidence matrix and 24 original diagrams. The diagrams
were visually checked; the PDF contains no gameplay screenshots. The manuscript's missing PNG
references now link to the matching PDF pages. Rockstar's [official screenshot gallery](https://www.rockstargames.com/VI/media/screenshots)
listed 138 captures when checked on 27 November and is linked as the primary visual reference. These checks confirm the
publication package and its visual labeling, not every gameplay claim or source; owner provenance
and broader historical/license review remain part of issue #2. No Word file, ZIP or generation
source was supplied.

## Remaining publication work

- Complete the repository-owner settings and historical/attachment/log review tracked in
  [issue #2](https://github.com/smouj/calm-rp-framework/issues/2): enable private vulnerability
  reporting and Secret Protection, require one approval and `CI / validate` on `main`, and finish
  the licensing/provenance review. The automated path scanners are not a substitute for that audit.
- Keep the GTA VI adapter disabled until first-party authorization and callable runtime contracts
  are verifiable.
