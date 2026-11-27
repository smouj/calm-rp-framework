# CALM release readiness — 27 November 2026

**Project:** CALM Essentials, an independent roleplay framework  
**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework)  
**Purpose:** current technical and publication status; this is not legal advice or a live CI badge.

## Current status

| Gate                       | Status                   | Evidence and limits                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product scope              | **DEFINED**              | CALM owns its roleplay domains and contracts. External frameworks are context only.                                                                                                                                                                                                        |
| F1 persistence             | **IMPLEMENTED**          | PostgreSQL accounts, characters, sessions and double-entry ledger; F1 hardening merged in [PR #57](https://github.com/smouj/calm-rp-framework/pull/57), with PR-head and post-merge CI green.                                                                                              |
| F2 inventory               | **SCHEMA AND CONTRACT**  | Additive migration `0005`, ownership/location ADR and typed store boundary are delivered in the current F2 stage. Runtime repository/service, authenticated operation flow and restart/concurrency acceptance remain in issue [#54](https://github.com/smouj/calm-rp-framework/issues/54). |
| GTA VI integration         | **BLOCKED**              | No authorized, verified GTA VI runtime or community-server API is established; no playable client or server is claimed.                                                                                                                                                                    |
| Local toolchain            | **VERIFIED LOCALLY**     | 2026-11-27: `pnpm check`, build, audit, artifact/secret scans and site integrity pass. Local live PostgreSQL remains gated on `DATABASE_URL`.                                                                                                                                              |
| Hosted PR CI               | **REQUIRED PER CHANGE**  | CI runs unit/integration checks and PostgreSQL 17 on each PR head. Merge only after that exact final-head run succeeds.                                                                                                                                                                    |
| Third-party artifacts      | **GUARDED, NOT CLEARED** | Path and secret checks are partial controls; they do not scan ignored files, file contents, the entire history, PR attachments or every Actions log.                                                                                                                                       |
| Legal and trademark review | **PRELIMINARY**          | See the interoperability/IP review. Source publication does not establish game integration rights.                                                                                                                                                                                         |
| Production operations      | **NOT READY**            | No deployed service, public game transport, production runbook or authorized adapter is provided by this repository.                                                                                                                                                                       |

## Verified local checks

The final candidate must pass:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm check:artifacts
pnpm check:secrets
pnpm check:site
```

The local PostgreSQL tests use the embedded engine. Hosted CI separately supplies PostgreSQL 17
for the live multi-connection suite. A skipped local live suite does not count as a live database
result.

## Remaining publication work

- Complete the remaining transactional service/repository and simulator work in F2; keep issue #54 open until every listed acceptance criterion and hosted PostgreSQL check passes.
- Complete the repository-owner security settings and historical/attachment/log review tracked in
  [issue #2](https://github.com/smouj/calm-rp-framework/issues/2). The automated path scanners are
  not a substitute for that audit.
- Keep the GTA VI adapter disabled until first-party authorization and callable runtime contracts
  are verifiable.
