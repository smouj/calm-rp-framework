# Branch retirement — completed 24 November 2026

**State:** the repository now has a single branch, `main`. This document records what was removed,
why it was safe to remove, and where the preserved history lives.

## Result

| Before                                      | After                |
| ------------------------------------------- | -------------------- |
| 12 branches (1 `main` + 11 historical refs) | 1 branch (`main`)    |
| 0 open pull requests                        | 0 open pull requests |

`main` at the time of cleanup: `4ab7097` (verification repairs and the legal-basis document).

## Backup taken before deletion

A complete mirror of every branch and pull-request ref was captured first and verified:

- `backups/gta6-rp-platform-branches-20261124.bundle` (449 KB, `git bundle verify` clean)
- Contains all 12 branch heads plus `refs/pull/*`
- SHA-256 prefix: `c6093e3265aefb442a43896b6c767568`

> This bundle contains private repository history. **Do not publish or upload it.**

Because the bundle holds the full graph, deleting the remote refs lost nothing: any branch can be
restored with `git fetch <bundle> <branch>:<branch>`.

## Branches removed and why each was safe

| Branch                                                         | Ahead of main | Assessment                                                                |
| -------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| `chore/professional-foundation`                                | 16            | Superseded; its scaffolding was merged via PR #1                          |
| `community/open-source-foundation-2026-11-23`                  | 51            | Merged via PR #30                                                         |
| `docs/autonomous-research-watch`                               | 3             | `AUTONOMOUS_RESEARCH.md` already on `main`                                |
| `docs/server-readiness-scope`                                  | 71            | Merged via PR #9                                                          |
| `feat/portable-rp-foundation-and-pages-20261124`               | 2             | **Alternative** `RoleplayKernel`, deliberately not merged                 |
| `research/cfx-enhanced-2026-09-22`                             | 0             | Strict ancestor of `main`; nothing to lose                                |
| `research/cfx-service-status-2026-09-12`                       | 1             | Research folded into `PLATFORM_STATUS.md`                                 |
| `research/gta6-single-player-confirmation-20260909`            | 1             | Same                                                                      |
| `research/leonida-readiness-2026-11-23`                        | 10            | Older `LEONIDA_2026-11-23.md`; `main` has the later, better-scoped policy |
| `research/nopixel-v-rockstar-launcher-2026-09-03`              | 2             | Research folded into `PLATFORM_STATUS.md`                                 |
| `research/rockstar-launcher-fivem-interoperability-2026-09-06` | 1             | Same                                                                      |

### The one branch with unique work

`feat/portable-rp-foundation-and-pages-20261124` contained an **alternative** implementation,
`class RoleplayKernel`, which replaces rather than extends the public `InMemoryRoleplay` API. Merging
it would have broken existing core tests, types and imports. It was **not** merged and is preserved
only in the bundle above. If that design is ever revisited, restore the branch from the bundle and
rebase it onto the current core.

## Verification after cleanup

- `gh api .../branches` returns exactly `["main"]`.
- No open pull requests exist.
- `main` builds: `bash scripts/verify-local.sh` passes all 9 stages.
- The bundle verifies against a complete history.

## Note on the previous plan

An earlier version of this document proposed running `scripts/cleanup-legacy-branches.ps1` from
Windows. That script is retained for reference but was not needed: the deletion was performed over
the GitHub API after the same backup-verify-then-delete sequence the script enforces.
