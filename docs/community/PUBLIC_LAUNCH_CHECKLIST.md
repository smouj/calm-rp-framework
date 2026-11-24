# Public Repository Launch Checklist

**State:** ACTION REQUIRED — repository is still private until GitHub settings are changed.

This is the maintainer's release gate for opening an existing private repository to external contributions. Do not treat a polished README or a passing build as proof that historical private data is safe to publish.

## Suggested GitHub profile

**Repository name:** `calm-rp-framework` (renamed so the project title contains no third-party trademark)

**Short description** (set on GitHub About):

> Unofficial, community-built open-source foundations for a future GTA VI roleplay platform. GTA VI multiplayer integration is not available.

**Topics** (copy to GitHub About; all lower-case):

`gta6`, `grand-theft-auto-vi`, `roleplay`, `multiplayer`, `open-source`, `community-driven`, `typescript`, `game-development`, `game-server`, `server-authoritative`, `rp-framework`, `simulation`

These topics express interests and project aspiration; they are **not** evidence of working GTA VI multiplayer.

**Website:** leave blank until a verified project website exists.

**Social preview:** original project-owned graphics only, never official GTA VI/Rockstar logos or key art.

## Security review before visibility changes

- [x] Inspect all commits reachable from the fetched branches, including deleted files, merge history and tags; review the available pull request history.
- [x] Inspect GitHub Actions history, available job logs, artifacts and failed workflow output for passwords, tokens, private URLs, copyrighted data, personal details and secrets.
- [x] Check issue/PR bodies, comments and available attachments; public visibility may expose historical discussions.
- [x] Run an independent local secret-pattern scan against all reachable history and manually review the two local-placeholder matches.
- [x] Document conduct-report boundaries: GitHub's **Report content** controls cover GitHub-hosted content; the linked Discord is for general questions only and is not monitored for private moderator messages. There is no confidential project channel for off-platform conduct reports; do not solicit sensitive details in public.
- [ ] Verify ownership and the ability to distribute every committed file and dependency. Do not license third-party code without permission.
- [ ] Rotate compromised keys **before** exposure, even if the secret is removed from the latest commit.
- [ ] If history cannot be cleaned safely, **create a new clean public repository** containing only approved content instead of exposing the private repository's history.
- [ ] Confirm all merged material uses original/synthetic data and does not contain GTA VI game assets, leaked material, private APIs or sensitive exports.

Neither `.gitignore` nor a single-branch scan makes a private repository safe to publish.

## Repository review record (2026-11-23)

The following local/API checks were completed, but **do not amount to public-release clearance**:

- Fetched all **18 current remote branches** and scanned all reachable Git history: **193 commits, 878 objects and 228 file blobs**. No private-key, AWS/GitHub/Slack token patterns were found. The only credential-pattern matches were the known local placeholders in `.env.example` and `infrastructure/docker/compose.yml`; commit author identities use GitHub's `users.noreply.github.com` address format. No tags were present.
- Reviewed the bodies and file patches for all **25 pull requests**, the discussion timelines, and the five standalone issues. No user-uploaded attachments or proprietary game-file paths were found. The only broad-pattern matches were `.env.example` and `infrastructure/docker/compose.yml`; their values are local-development placeholders, not credentials.
- The CI workflow uses read-only repository permissions, pinned checkout/setup actions and does not reference repository secrets. The Actions snapshot reviewed after run #123 contained **155 runs** and **154 jobs**. All **135 available job logs** were scanned; **19 jobs** had no steps or logs; none of those 155 runs had artifacts. No credential, non-GitHub email or proprietary game-file patterns were found in the available logs. Recent `main` runs including [#123](https://github.com/smouj/calm-rp-framework/actions/runs/45240220076) failed before runner assignment, with no steps, log or artifacts; its log endpoint returned `404 BlobNotFound`. Local checks passed during the launch audit, but hosted CI remains unavailable.
- The GitHub Security page reports **zero open Dependabot vulnerability alerts** and **zero open malware alerts** after the dependency scan on 2026-11-23. The dependency graph, Dependabot alerts, malware alerts and security updates are enabled.
- GitHub code scanning is disabled for this private personal repository; the Security page says Advanced Security is only available for organizations. Secret scanning, push protection and private vulnerability reporting do not appear in the available settings. Check what becomes available after public visibility and enable it where offered.
- Actions are enabled. The repository requires actions to be pinned to full-length commit SHAs, and the default `GITHUB_TOKEN` has read-only contents/packages permissions. Fork-PR workflows are not enabled for this private repository; public fork PRs use GitHub's restricted token and first-time runs require approval.
- The repository is still private. The About description and 12 topics are configured. Discussions are enabled without a welcome post. Direct access review found **zero collaborators**; only the owner has access. A `main` branch protection rule requires pull requests, linear history and resolved conversations, disallows force pushes/deletion and does not allow admin bypass. GitHub says the rule is not enforced while this repository is private on the current plan; verify enforcement after public visibility. The maintainer supplied a Discord invite for general questions only; no private moderator route or confidential off-platform conduct channel is offered.

Before public visibility, the historical Git/PR/Actions review is complete, no current dependency or malware alerts are open, and direct access is owner-only. After public visibility, verify `main` protection, enable available secret/code scanning and private vulnerability reporting, and keep sensitive conduct details out of public GitHub content and Discord. If any historically exposed credential was live, rotate it.

## Merge and validation gates

- [x] Review and squash-merge the open-source scope/license/documentation PR #30 into `main` (`88e5091`).
- [x] Review [PR #25](https://github.com/smouj/calm-rp-framework/pull/25) and [PR #26](https://github.com/smouj/calm-rp-framework/pull/26); keep both as drafts for separate research/architecture review, and do not mix their feature work into the community-foundation merge.
- [x] Run `pnpm check` on the merged `main` tree (lint, typecheck, 11 tests and Prettier all pass).
- [ ] Resolve GitHub Actions jobs that fail **before starting any steps**; runner failures cannot be counted as a passing build.
- [x] Verify the MIT license applies only to original project code and documentation; game IP and third-party material remain excluded.
- [x] Reconcile the README, translated README, scope, accepted ADRs, roadmap, templates and security links; correct references that still called ADR-0006 proposed.

## Configure GitHub

After the security and merge gates are complete:

1. The repository **About** description and topics are set; leave the homepage blank until a verified project website exists.
2. In **Settings > General**, Issues and Discussions are enabled; keep Wiki and GitHub Pages disabled until useful.
3. Squash merging and automatic deletion of merged head branches are enabled. A `main` branch protection rule requires PRs, resolved conversations and linear history; force pushes and deletion remain disallowed. The current plan does not enforce it while private. Require successful `CI / validate` only after GitHub-hosted runs can start and pass; the current runner assignment failure must not be recorded as a passing check.
4. The dependency graph, Dependabot alerts, malware alerts and Dependabot security updates are enabled. Check whether code/secret scanning, push protection and private vulnerability reporting become available when public; enable them where available.
5. Review who has write/admin access. Keep `main` protected and prevent forced pushes or deletion once GitHub enforcement is available.
6. Verify labels used by issue forms and Dependabot (`bug`, `enhancement`, `dependencies`, `good first issue`, `help wanted`, `documentation`, `research`). Keep security vulnerabilities out of public issue labels and use [SECURITY.md](../../SECURITY.md).
7. In **Settings > General > Danger Zone > Change repository visibility**, select **Public** only after all reviews are complete.
8. Once public, verify README/badges, license detection, contributor workflow, discussion access and a clean checkout as an unauthenticated visitor.

GitHub explicitly warns that a private-to-public change exposes repository source and Actions history/logs and may disable push rulesets. Review the [GitHub visibility documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).

## Optional GitHub CLI configuration

Run locally **only after** you have authenticated `gh` with permission to administer the repository, completed the safety review and merged the documentation change.

```bash
gh repo edit smouj/calm-rp-framework --description "Unofficial open-source GTA VI RP platform project. Community-built roleplay foundations, simulator and research; GTA VI multiplayer integration not available."
gh repo edit smouj/calm-rp-framework --add-topic gta6,grand-theft-auto-vi,roleplay,multiplayer,open-source,community-driven,typescript,game-development,game-server,server-authoritative,rp-framework,simulation
gh repo edit smouj/calm-rp-framework --enable-discussions --enable-issues --enable-wiki=false --enable-squash-merge --delete-branch-on-merge
```

Visibility is intentionally **not** changed by this checklist. If approved after the audit, use the GitHub UI steps above or explicitly acknowledge the consequences with GitHub CLI:

```bash
gh repo edit smouj/calm-rp-framework --visibility public --accept-visibility-change-consequences
```

Do not run the visibility command as an unattended automation. GitHub repository settings require owner access; source changes alone cannot update them.

## After launch

- [ ] Publish a starter roadmap and at least a few genuine, bounded `good first issue` tickets.
- [ ] Review and respond to contributions without promising immediate support or a playable GTA VI release.
- [ ] Confirm the GitHub community profile and project links from a logged-out browser.
- [ ] Revisit Rockstar/Cfx policies before any game-facing release.
