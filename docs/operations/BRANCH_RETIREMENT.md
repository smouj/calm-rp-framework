# Historical branch retirement and backup plan

**Snapshot:** 24 November 2026. **Desired state:** only `main`. All eight previously open PRs (#10, #19, #21, #22, #23, #24, #26, #31) were merged into `main`; GitHub auto-deleted their source branches.

## Remaining branches (11 historical refs, not open PRs)

- `chore/professional-foundation`
- `community/open-source-foundation-2026-11-23`
- `docs/autonomous-research-watch`
- `docs/server-readiness-scope`
- `feat/portable-rp-foundation-and-pages-20261124`
- `research/cfx-enhanced-2026-09-22`
- `research/cfx-service-status-2026-09-12`
- `research/gta6-single-player-confirmation-20260909`
- `research/leonida-readiness-2026-11-23`
- `research/nopixel-v-rockstar-launcher-2026-09-03`
- `research/rockstar-launcher-fivem-interoperability-2026-09-06`

## Important: not all branches have identical file trees

- Most original launch/community/research data is now represented by newer material on `main`. Squash-merging means Git graphs may still show older branch-only commits even when their semantics were incorporated.
- **`feat/portable-rp-foundation-and-pages-20261124` contains a different `RoleplayKernel` implementation**, replacing rather than extending the currently public `InMemoryRoleplay` API. This alternative was NOT merged because it would break existing core tests, types and imports. Back up its full commit history if removing the branch.
- **`research/leonida-readiness-2026-11-23`** contains the historical `LEONIDA_2026-11-23.md` document. The source repository returned 404 during the November verification, and the main branch already has a later, cautiously scoped policy. Retain that older research only in the backup, not as a current GTA VI capability claim.
- `research/cfx-enhanced-2026-09-22` was an ancestor of `main` at this snapshot.

## Manual backup-and-delete instructions

The GitHub connector used for the merge does not expose deleting Git branch refs. We therefore **have not deleted these 11 branches**. To reach one branch safely, use the reviewed PowerShell script `scripts/cleanup-legacy-branches.ps1` on a Windows machine with Git and the authenticated GitHub CLI installed.

The script:

1. Confirms the repository, enumerates remote branches and previews all non-`main` refs.
2. Checks there are no open pull requests.
3. Creates a **local complete mirror and Git bundle** preserving all branch and tag history. Never commit the bundle, which can contain private content.
4. Requires explicit interactive confirmation before deleting all remote branches except `main`.
5. Verifies the remaining branch list and reports failures.

Run:

```powershell
gh auth login
pwsh -File scripts/cleanup-legacy-branches.ps1
pwsh -File scripts/cleanup-legacy-branches.ps1 -Apply
```

**Do not publish the private bundle.** Bypassing the backup can lose unique alternative work. This operation does not change repository visibility, tags, GitHub Pages settings or runtime integration eligibility.
