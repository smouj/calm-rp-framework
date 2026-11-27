# Public repository safety and launch follow-up

**State:** repository is public; owner-side safety and presentation checks remain open.
**Reviewed:** 2026-11-27
**Source of truth for remaining owner actions:** [issue #2](https://github.com/smouj/calm-rp-framework/issues/2)

This checklist tracks repository settings and release hygiene. It is not legal clearance, a security certification or evidence that CALM integrates with GTA VI.

## Current public repository snapshot

- GitHub reports the repository as **public**, with Issues, Discussions and Pages enabled; the homepage points to the CALM site.
- The default branch is `main`. At this review there are no open pull requests and three open issues: repository safety audit [#2](https://github.com/smouj/calm-rp-framework/issues/2), F1 closeout [#32](https://github.com/smouj/calm-rp-framework/issues/32), and F2 inventory [#54](https://github.com/smouj/calm-rp-framework/issues/54).
- The current About description and topics still imply a generic framework and GTA V/FiveM/RAGEmp targets. Correct these after the GTA VI-first scope change is merged.
- The scope change does not offer a playable mod, PC port, client, multiplayer server or authorized runtime adapter. No game files or leaked internals are project inputs.

## GitHub About metadata to apply

**Description:**

> CALM — an original GTA VI-first roleplay project. No authorized GTA VI multiplayer integration.

**Keep only project and target topics:** `calm`, `gta-vi`, `gta6`, `roleplay`, `open-source`, `community-driven`, `typescript`.

Remove topics that imply a generic framework or GTA V/FiveM/RAGEmp support, including `fivem`, `framework`, `ragemp`, and `rage`. Keep the existing homepage only while it points to the maintained CALM site.

## Owner-side safety checks

The preliminary history and platform scan recorded in issue #2 is useful evidence, but does not clear every file or setting. Complete and record each remaining item there:

- [ ] Review licensing/provenance across full Git history, pull-request attachments and relevant Actions logs.
- [ ] Apply the About description and target-specific topic list above.
- [ ] Confirm private vulnerability reporting, Dependabot, secret scanning and push protection are enabled where available.
- [ ] Confirm `main` protection requires the intended pull-request review and successful `CI / validate`, resolved conversations, and prohibits force-push and branch deletion.
- [ ] Verify the public profile, README rendering and contributor path from a logged-out session.

Path scanners and secret-pattern checks are partial controls. They do not inspect ignored files, every file's content, all retained historical material or every attachment. Do not treat a clean scanner result as legal or security clearance.

## Change and release gates

- Keep F1 issue #32 open until its API/transport, attributable privileged-grant audit, request limits, failure tests and threat-model review are complete.
- Keep F2 issue #54 open until its full acceptance criteria pass, including the live PostgreSQL 17 multi-connection tests on the exact pull-request head.
- Run the documented local checks before creating a pull request. Merge only when the final PR head has successful hosted CI and review requirements are satisfied.
- Keep the GTA VI adapter blocked until a documented, authorized runtime contract and compatible test environment exist. Simulator success only verifies CALM's own rules.

## Historical review record

The 2026-11-23 private-repository audit, recorded before the repository was opened, checked reachable Git objects, then-existing pull requests/issues and available Actions history. It reported no secret-pattern matches beyond documented local placeholders and no prohibited artifact paths in that reviewed snapshot. That result is time-bounded and does not cover material added since then or replace the owner-side review above.
