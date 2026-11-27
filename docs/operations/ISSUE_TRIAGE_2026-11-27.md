# Issue and pull request triage — 27 November 2026

**Repository:** [`smouj/calm-rp-framework`](https://github.com/smouj/calm-rp-framework) · **Checked:** GitHub issues and pull requests, branch refs, local verification record · **Snapshot:** 27 November 2026.

## Open pull requests

| Item                                                                                      | Owner   | State                  | Required verification / next action                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------- | ------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#59 — GTA VI scope and F2 inventory](https://github.com/smouj/calm-rp-framework/pull/59) | `smouj` | Open; active candidate | Recheck the latest PR-head workflow, including the real PostgreSQL 17 multi-connection suite; resolve review threads and merge only with required checks green. Retire the review branch after the merge and verify the post-merge `main` workflow. |

No other open pull requests were returned by the repository query on this date.

## Open issues

| Item                                                                                           | Owner   | State                          | Remaining work and verification                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#2 — repository safety and launch audit](https://github.com/smouj/calm-rp-framework/issues/2) | `smouj` | Open; owner-side audit         | Review history, file/licensing provenance, PR attachments and relevant Actions logs; update repository description/topics; verify vulnerability reporting, Dependabot, secret scanning, push protection, branch protections, logged-out profile and contributor path. Record evidence in the issue before closing. |
| [#32 — F1 identity and economy](https://github.com/smouj/calm-rp-framework/issues/32)          | `smouj` | Open; implementation follow-up | Complete authenticated API/transport wiring, attributable privileged-grant auditing, bounded inputs and rate limits, lost-connection and privileged-failure coverage, and threat-model review. Verify the listed failure/concurrency tests and hosted CI before closing.                                           |
| [#54 — F2 carried inventory and storage](https://github.com/smouj/calm-rp-framework/issues/54) | `smouj` | Open; candidate in #59         | Verify every acceptance criterion against the merged implementation; require the exact PR head's PostgreSQL 17 race suite and all other required CI checks to pass. Keep open until then.                                                                                                                          |

All three issues are assigned and have explicit remaining verification steps. They are active work, not stale issues. No issue is closed by PR #59.

## Branch cleanup

- `main` remains the integration branch. The temporary `codex/calm-f2-persistence-service` branch carries PR #59 and should be removed only after merge verification.
- The remote `docs/f2-inventory-contract-20261125` branch had no associated PR and was three commits behind `main` with zero commits ahead; it was deleted after that comparison.
- Two local-only pre-PR snapshots (`codex/calm-f2-design-schema` at `cda3bab` and `codex/calm-professionalization-2026-11-27` at `779cc9f`) were retired after preserving their refs in a verified, local-only Git bundle at `.git/calm-local-branch-snapshots-2026-11-27.bundle`. The bundle is not tracked or published and will not be available from a fresh clone.

## Product boundary

CALM remains GTA VI-first in product intent and owns its roleplay rules. This triage does not claim a GTA VI runtime or authorized game interface. Do not use game files, leaked material, extracted internals or third-party game assets in the project.
