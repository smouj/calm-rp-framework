# Public repository safety and launch follow-up

**State:** repository and public presentation checks are verified; provenance review and several owner-managed protections remain open.
**Reviewed:** 2026-11-27
**Source of truth for remaining owner actions:** [issue #2](https://github.com/smouj/calm-rp-framework/issues/2)

This checklist tracks repository settings and release hygiene. It is not legal clearance, a security certification or evidence that CALM integrates with GTA VI.

## Current public repository snapshot

- GitHub reports the repository as **public**, with Issues, Discussions and Pages enabled; the homepage points to the CALM site.
- The default branch is `main`. PRs #57, #59, #60, #61 and #62 are merged; F1 issue [#32](https://github.com/smouj/calm-rp-framework/issues/32) and F2 issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) are completed. Only the repository safety audit [#2](https://github.com/smouj/calm-rp-framework/issues/2) remains open.
- The repository About description and topics identify CALM as GTA VI-first and remove legacy GTA V/FiveM/RAGEmp or generic-framework implications. The target-specific website is live, and its profile, README and contributor paths were checked anonymously.
- The scope change does not offer a playable mod, PC port, client, multiplayer server or authorized runtime adapter. No game files or leaked internals are project inputs.

## Published GitHub About metadata

**Published description:**

> CALM — an original GTA VI-first roleplay project. No authorized GTA VI multiplayer integration.

**Published topics:** `calm`, `game-development`, `gta`, `gta-vi`, `gta6`, `leonidas`, `modular`, `open-source`, `roleplay`, `typescript`.

The stale `fivem`, `framework`, `ragemp` and `rage` topics were removed. Keep the existing homepage only while it points to the maintained CALM site.

## Owner-side safety checks

Read-only inspection of GitHub's repository settings on 2026-11-27 verified the controls below. The preliminary history and platform scan recorded in issue #2 is useful evidence, but does not clear every file or setting.

- [ ] Review licensing/provenance across full Git history, pull-request attachments and relevant Actions logs.
- [x] Update the About description and remove outdated compatibility/framework topics; the current published topic list is recorded above.
- [x] Dependency graph, Dependabot alerts, malware alerts and Dependabot security updates are enabled.
- [ ] Enable private vulnerability reporting; it is currently disabled.
- [ ] Enable Secret Protection, then verify secret scanning and push protection; Secret Protection is currently disabled.
- [x] `main` requires pull requests and conversation resolution, enforces linear history, blocks force pushes and deletions, and disallows administrator bypass.
- [ ] Require at least one approving review for `main`; approvals are currently not required.
- [ ] Require the `CI / validate` status check for `main`; no required status checks are currently configured.
- [x] Verify the public profile, rendered README, and English/Spanish contributor guides from an unauthenticated session; each returned HTTP 200 with the expected page.

Path scanners and secret-pattern checks are partial controls. They do not inspect ignored files, every file's content, all retained historical material or every attachment. Do not treat a clean scanner result as legal or security clearance.

## Change and release gates

- F1 issue #32 is completed by merged PR #61; keep the runtime integration boundary explicit in future work.
- F2 issue #54 is completed after merge and exact-head PostgreSQL 17 verification; keep its evidence in the issue and release record.
- Run the documented local checks before creating a pull request. Merge only when the final PR head has successful hosted CI and a human review; branch protection currently does not enforce an approval or the `CI / validate` check.
- Keep the GTA VI adapter blocked until a documented, authorized runtime contract and compatible test environment exist. Simulator success only verifies CALM's own rules.

## Historical review record

The 2026-11-23 private-repository audit, recorded before the repository was opened, checked reachable Git objects, then-existing pull requests/issues and available Actions history. It reported no secret-pattern matches beyond documented local placeholders and no prohibited artifact paths in that reviewed snapshot. That result is time-bounded and does not cover material added since then or replace the owner-side review above.
