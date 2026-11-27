# Issue and pull request triage — 27 November 2026

**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework) · **Checked:** GitHub issues, pull requests, branch refs and post-merge workflows.

## Merged pull requests

| Item                                                                                          | Result                                                                                                                      |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [#57 — F1 persistence foundation](https://github.com/smouj/calm-rp-framework/pull/57)         | Merged; post-merge PostgreSQL CI passed.                                                                                    |
| [#59 — GTA VI scope and F2 inventory](https://github.com/smouj/calm-rp-framework/pull/59)     | Merged; exact-head PostgreSQL 17 CI passed; issue #54 completed.                                                            |
| [#60 — CALM site atmosphere](https://github.com/smouj/calm-rp-framework/pull/60)              | Merged; Pages deployment and post-merge CI passed.                                                                          |
| [#61 — F1 identity and economy transport](https://github.com/smouj/calm-rp-framework/pull/61) | Merged as `96195bd`; exact-head CI #232 and post-merge `main` CI #233 passed, including PostgreSQL 17; issue #32 completed. |

No product pull request remains open at this snapshot.

## Open issues

| Item                                                                                           | Owner   | State                  | Remaining work                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#2 — repository safety and launch audit](https://github.com/smouj/calm-rp-framework/issues/2) | `smouj` | Open; owner-side audit | Review full licensing/provenance across history, PR attachments and relevant Actions logs; verify private vulnerability reporting, Dependabot, secret scanning, push protection and `main` branch protection. Public profile, rendered README and English/Spanish contribution paths were checked anonymously and returned HTTP 200. |

F1 issue #32 and F2 issue #54 are closed as completed. Issue #2 remains open because the connected GitHub integration cannot inspect classic branch-protection settings or repository security controls; its history and attachment review also needs maintainer evidence.

## Branch cleanup

- `main` remains the integration branch. `codex/f1-api-security-closeout` is merged; it contains no unmerged work.
- The remote `docs/f2-inventory-contract-20261125` branch had no associated PR and was three commits behind `main` with zero commits ahead; it was deleted after that comparison.
- Two local-only pre-PR snapshots (`codex/calm-f2-design-schema` at `cda3bab` and `codex/calm-professionalization-2026-11-27` at `779cc9f`) were retired after preserving their refs in a verified, local-only Git bundle at `.git/calm-local-branch-snapshots-2026-11-27.bundle`. The bundle is not tracked or published and will not be available from a fresh clone.

## Product boundary

CALM remains GTA VI-first in product intent and owns its roleplay rules. This triage does not claim a GTA VI runtime or authorized game interface. Do not use game files, leaked material, extracted internals or third-party game assets in the project.
