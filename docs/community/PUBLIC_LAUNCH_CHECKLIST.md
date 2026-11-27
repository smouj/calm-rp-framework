# Public repository safety and launch follow-up

**State:** repository is public; owner-side safety and presentation checks remain open.
**Reviewed:** 2026-11-27
**Source of truth for remaining owner actions:** [issue #2](https://github.com/smouj/calm-rp-framework/issues/2)

This checklist tracks repository settings and release hygiene. It is not legal clearance, a security certification or evidence that CALM integrates with GTA VI.

## Current public repository snapshot

- GitHub reports the repository as **public**, with Issues, Discussions and Pages enabled; the homepage points to the CALM site.
- The default branch is `main`. PRs #57, #59 and #60 are merged; F2 issue [#54](https://github.com/smouj/calm-rp-framework/issues/54) is completed. The remaining open issues are the repository safety audit [#2](https://github.com/smouj/calm-rp-framework/issues/2) and F1 closeout [#32](https://github.com/smouj/calm-rp-framework/issues/32).
- The repository About description and topics now identify CALM as GTA VI-first and remove generic GTA V/FiveM/RAGEmp implications. The target-specific website is live; maintainer-owned security and logged-out checks remain open.
- The scope change does not offer a playable mod, PC port, client, multiplayer server or authorized runtime adapter. No game files or leaked internals are project inputs.

## GitHub About metadata to apply

**Published description:**

> CALM — an original GTA VI-first roleplay project. No authorized GTA VI multiplayer integration.

**Published project and target topics:** `calm`, `gta-vi`, `gta6`, `roleplay`, `open-source`, `community-driven`, `typescript`.

Remove topics that imply a generic framework or GTA V/FiveM/RAGEmp support, including `fivem`, `framework`, `ragemp`, and `rage`. Keep the existing homepage only while it points to the maintained CALM site.

## Owner-side safety checks

The preliminary history and platform scan recorded in issue #2 is useful evidence, but does not clear every file or setting. Complete and record each remaining item there:

- [ ] Review licensing/provenance across full Git history, pull-request attachments and relevant Actions logs.
- [x] Apply the About description and target-specific topic list above; the remaining checks are owner-side settings and review.
- [ ] Confirm private vulnerability reporting, Dependabot, secret scanning and push protection are enabled where available.
- [ ] Confirm `main` protection requires the intended pull-request review and successful `CI / validate`, resolved conversations, and prohibits force-push and branch deletion.
- [ ] Verify the public profile, README rendering and contributor path from a logged-out session.

Path scanners and secret-pattern checks are partial controls. They do not inspect ignored files, every file's content, all retained historical material or every attachment. Do not treat a clean scanner result as legal or security clearance.

## Change and release gates

- Keep F1 issue #32 open until its API/transport, attributable privileged-grant audit, request limits, failure tests and threat-model review are complete.
- F2 issue #54 is completed after merge and exact-head PostgreSQL 17 verification; keep its evidence in the issue and release record.
- Run the documented local checks before creating a pull request. Merge only when the final PR head has successful hosted CI and review requirements are satisfied.
- Keep the GTA VI adapter blocked until a documented, authorized runtime contract and compatible test environment exist. Simulator success only verifies CALM's own rules.

## Historical review record

The 2026-11-23 private-repository audit, recorded before the repository was opened, checked reachable Git objects, then-existing pull requests/issues and available Actions history. It reported no secret-pattern matches beyond documented local placeholders and no prohibited artifact paths in that reviewed snapshot. That result is time-bounded and does not cover material added since then or replace the owner-side review above.
