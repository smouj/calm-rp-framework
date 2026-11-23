# Public Repository Launch Checklist

**State:** ACTION REQUIRED — repository is still private until GitHub settings are changed.

This is the maintainer's release gate for opening an existing private repository to external contributions. Do not treat a polished README or a passing build as proof that historical private data is safe to publish.

## Suggested GitHub profile

**Repository name:** `gta6-rp-platform` (retain the existing URL)

**Short description** (copy to GitHub About):

> Unofficial open-source GTA VI RP platform project. Community-built roleplay foundations, simulator and research; GTA VI multiplayer integration not available.

**Topics** (copy to GitHub About; all lower-case):

`gta6`, `grand-theft-auto-vi`, `roleplay`, `multiplayer`, `open-source`, `community-driven`, `typescript`, `game-development`, `game-server`, `server-authoritative`, `rp-framework`, `simulation`

These topics express interests and project aspiration; they are **not** evidence of working GTA VI multiplayer.

**Website:** leave blank until a verified project website exists.

**Social preview:** original project-owned graphics only, never official GTA VI/Rockstar logos or key art.

## Security review before visibility changes

- [ ] Inspect **all commits and historical trees**, including deleted files, branches, tags, pull requests and merge references.
- [ ] Inspect GitHub Actions history, job logs, artifacts and failed workflow output for passwords, tokens, private URLs, copyrighted data, personal details and secrets.
- [ ] Check issue/PR bodies, comments and attachments; public visibility may expose historical discussions.
- [ ] Run an independent local secret scan against all reachable history; review results manually.
- [ ] Verify ownership and the ability to distribute every committed file and dependency. Do not license third-party code without permission.
- [ ] Rotate compromised keys **before** exposure, even if the secret is removed from the latest commit.
- [ ] If history cannot be cleaned safely, **create a new clean public repository** containing only approved content instead of exposing the private repository's history.
- [ ] Confirm all merged material uses original/synthetic data and does not contain GTA VI game assets, leaked material, private APIs or sensitive exports.

Neither `.gitignore` nor a single-branch scan makes a private repository safe to publish.

## Initial limited review record (2026-11-23)

A preliminary scan inspected path listings on **19 accessible branches**; no paths with proprietary game package extensions, private-key file extensions or credential-file names were found beyond the intentional `.env.example` placeholder. The **eight commits on `main`** were sampled for common secret patterns in available GitHub diff patches (84 changed-file patches). Two files triggered heuristic matches: `.env.example` and `infrastructure/docker/compose.yml`, both currently configured with explicit *local-development placeholders* rather than actual credentials.

This is **not** comprehensive clearance: the scan does not inspect every blob across all branch histories, removed files outside the sampled commits, Actions logs, PR comments/attachments or GitHub secret-scanning results. Those checks remain required before public visibility. If any historically exposed credential was live, rotate it.

## Merge and validation gates

- [ ] Review and merge the open-source scope/license/documentation PR with deliberate maintainer approval.
- [ ] Reconcile conflicting open work, particularly [PR #25](https://github.com/smouj/gta6-rp-platform/pull/25) and [PR #26](https://github.com/smouj/gta6-rp-platform/pull/26), which still assume parts of the old private-server scope.
- [ ] Ensure `pnpm check` passes on the **actual final commit** (lint, typecheck, unit tests and Prettier).
- [ ] Resolve GitHub Actions jobs that fail **before starting any steps**; runner failures cannot be counted as a passing build.
- [ ] Verify the MIT license applies only to contributor-owned code and documentation.
- [ ] Verify README, translated README, scope, ADRs, roadmap, templates and security links do not contradict each other.

## Configure GitHub

After the security and merge gates are complete:

1. In the repository **About** settings, set description and topics exactly as proposed above; do not invent a homepage.
2. In **Settings > General**, enable Issues and Discussions; keep Wiki and GitHub Pages disabled until useful.
3. Enable squash merge and delete merged head branches. Require pull requests, review, resolved conversations and successful `CI / validate` on `main` through branch protection or a ruleset.
4. Enable dependency alerts, code/secret scanning and push protection where available. Enable private vulnerability reporting.
5. Review who has write/admin access. Keep `main` protected and prevent forced pushes or deletion.
6. Verify labels used by issue forms (`bug`, `enhancement`, `dependencies`, `good first issue`, `help wanted`, `documentation`, `research`, `security`). Create missing labels if needed.
7. In **Settings > General > Danger Zone > Change repository visibility**, select **Public** only after all reviews are complete.
8. Once public, verify README/badges, license detection, contributor workflow, discussion access and a clean checkout as an unauthenticated visitor.

GitHub explicitly warns that a private-to-public change exposes repository source and Actions history/logs and may disable push rulesets. Review the [GitHub visibility documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).

## Optional GitHub CLI configuration

Run locally **only after** you have authenticated `gh` with permission to administer the repository, completed the safety review and merged the documentation change.

```bash
gh repo edit smouj/gta6-rp-platform --description "Unofficial open-source GTA VI RP platform project. Community-built roleplay foundations, simulator and research; GTA VI multiplayer integration not available."
gh repo edit smouj/gta6-rp-platform --add-topic gta6,grand-theft-auto-vi,roleplay,multiplayer,open-source,community-driven,typescript,game-development,game-server,server-authoritative,rp-framework,simulation
gh repo edit smouj/gta6-rp-platform --enable-discussions --enable-issues --enable-wiki=false --enable-squash-merge --delete-branch-on-merge
```

Visibility is intentionally **not** changed by this checklist. If approved after the audit, use the GitHub UI steps above or explicitly acknowledge the consequences with GitHub CLI:

```bash
gh repo edit smouj/gta6-rp-platform --visibility public --accept-visibility-change-consequences
```

Do not run the visibility command as an unattended automation. GitHub repository settings require owner access; source changes alone cannot update them.

## After launch

- [ ] Publish a starter roadmap and at least a few genuine, bounded `good first issue` tickets.
- [ ] Review and respond to contributions without promising immediate support or a playable GTA VI release.
- [ ] Confirm the GitHub community profile and project links from a logged-out browser.
- [ ] Revisit Rockstar/Cfx policies before any game-facing release.
