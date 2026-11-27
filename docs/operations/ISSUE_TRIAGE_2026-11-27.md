# Issue and pull request triage — 27 November 2026

**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework) · **Checked:** GitHub issues, pull requests, branch refs and post-merge workflows.

## Merged pull requests

| Item                                                                                                   | Result                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| [#57 — F1 persistence foundation](https://github.com/smouj/calm-rp-framework/pull/57)                  | Merged; post-merge PostgreSQL CI passed.                                                                                    |
| [#59 — GTA VI scope and F2 inventory](https://github.com/smouj/calm-rp-framework/pull/59)              | Merged; exact-head PostgreSQL 17 CI passed; issue #54 completed.                                                            |
| [#60 — CALM site atmosphere](https://github.com/smouj/calm-rp-framework/pull/60)                       | Merged; Pages deployment and post-merge CI passed.                                                                          |
| [#61 — F1 identity and economy transport](https://github.com/smouj/calm-rp-framework/pull/61)          | Merged as `96195bd`; exact-head CI #232 and post-merge `main` CI #233 passed, including PostgreSQL 17; issue #32 completed. |
| [#62 — verified F1 closeout and repository status](https://github.com/smouj/calm-rp-framework/pull/62) | Merged as `d399ab5`; exact-head CI #234 and post-merge `main` CI #235 passed, including PostgreSQL 17.                      |
| [#63 — observed repository protections](https://github.com/smouj/calm-rp-framework/pull/63)            | Merged as `23af096`; exact-head CI #236 and post-merge `main` CI #237 passed, including PostgreSQL 17.                      |
| [#64 — align closeout snapshot with PR #63](https://github.com/smouj/calm-rp-framework/pull/64)        | Merged as `011646b`; exact-head CI #238 and post-merge `main` CI #239 passed, including PostgreSQL 17.                      |

No product pull request remains open at this snapshot.

## Open issues

| Item                                                                                           | Owner   | State                  | Remaining work                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------- | ------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#2 — repository safety and launch audit](https://github.com/smouj/calm-rp-framework/issues/2) | `smouj` | Open; owner-side audit | Review full licensing/provenance across history, PR attachments and relevant Actions logs; enable private vulnerability reporting and Secret Protection; require an approving review and `CI / validate` on `main`. Dependabot alerts/security updates are enabled; public profile, README and contributor paths returned HTTP 200. |

F1 issue #32 and F2 issue #54 are closed as completed. Read-only GitHub settings inspection confirmed that `main` requires a PR and conversation resolution, enforces linear history, and blocks force-push, deletion and admin bypass; it does not require approval or CI status checks. Dependency graph, Dependabot alerts, malware alerts and security updates are enabled; private vulnerability reporting and Secret Protection are off. Issue #2 remains open until those settings and the full history/attachment review are completed.

## Branch cleanup

- The local branch cleanup was first checked at `d399ab5` after PR #62; PR #63 then merged as `23af096` and PR #64 as `011646b`. At this snapshot the only local and remote branch is `main`; local topic branches for merged PRs #59–#64 were retired after matching each branch head to its merged PR.
- The remote `docs/f2-inventory-contract-20261125` branch had no associated PR and was three commits behind `main` with zero commits ahead; it was deleted after that comparison.
- Two local-only pre-PR snapshots (`codex/calm-f2-design-schema` at `cda3bab` and `codex/calm-professionalization-2026-11-27` at `779cc9f`) were retired after preserving their refs in a verified, local-only Git bundle at `.git/calm-local-branch-snapshots-2026-11-27.bundle`. The bundle is not tracked or published and will not be available from a fresh clone.

## Product boundary

CALM remains GTA VI-first in product intent and owns its roleplay rules. This triage does not claim a GTA VI runtime or authorized game interface. Do not use game files, leaked material, extracted internals or third-party game assets in the project.
