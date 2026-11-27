# Issue and pull request triage — 27 November 2026

**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework) · **Checked:** GitHub issues and pull requests, branch refs, local verification record · **Snapshot:** 27 November 2026.

## Open pull requests

| Item                                                                                          | Owner   | State                       | Required verification / next action                                                                                                                                                           |
| --------------------------------------------------------------------------------------------- | ------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#61 — F1 identity and economy transport](https://github.com/smouj/calm-rp-framework/pull/61) | `smouj` | Open; exact-head CI pending | Require all hosted checks, including PostgreSQL 17, on the current PR head; review the implementation, merge only when green, then verify the post-merge `main` workflow and close issue #32. |

PRs #57, #59 and #60 are merged. No other open pull requests were returned by the repository query.

## Open issues

| Item                                                                                           | Owner   | State                       | Remaining work and verification                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#2 — repository safety and launch audit](https://github.com/smouj/calm-rp-framework/issues/2) | `smouj` | Open; owner-side audit      | Review history, file/licensing provenance, PR attachments and relevant Actions logs; verify vulnerability reporting, Dependabot, secret scanning, push protection, branch protections, logged-out profile and contributor path. Record evidence in the issue before closing. |
| [#32 — F1 identity and economy](https://github.com/smouj/calm-rp-framework/issues/32)          | `smouj` | Open; implementation in #61 | Review PR #61, require exact-head hosted CI and merge evidence. Its local implementation covers API/session authority, audited grants, transport limits, lost responses and rollback; close only when the remaining acceptance checks pass.                                  |

Both open issues are assigned and have explicit remaining verification steps. F2 issue #54 is closed as completed after PR #59; no stale F2 follow-up remains.

## Branch cleanup

- `main` remains the integration branch. `codex/f1-api-security-closeout` carries PR #61 and should be retired only after merge verification.
- The remote `docs/f2-inventory-contract-20261125` branch had no associated PR and was three commits behind `main` with zero commits ahead; it was deleted after that comparison.
- Two local-only pre-PR snapshots (`codex/calm-f2-design-schema` at `cda3bab` and `codex/calm-professionalization-2026-11-27` at `779cc9f`) were retired after preserving their refs in a verified, local-only Git bundle at `.git/calm-local-branch-snapshots-2026-11-27.bundle`. The bundle is not tracked or published and will not be available from a fresh clone.

## Product boundary

CALM remains GTA VI-first in product intent and owns its roleplay rules. This triage does not claim a GTA VI runtime or authorized game interface. Do not use game files, leaked material, extracted internals or third-party game assets in the project.
