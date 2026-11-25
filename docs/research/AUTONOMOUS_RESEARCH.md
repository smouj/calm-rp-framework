# Autonomous Research Watch

**State:** ACTIVE

This document defines the automated research loop that keeps the GTA VI RP readiness knowledge base current without weakening the project's evidence standards.

The automation exists to reduce stale documentation, not to predict undocumented GTA VI internals or turn rumors into implementation contracts.

## Objective

The watcher periodically checks for material public developments that affect this repository and compares them against the canonical project knowledge in:

- `PLATFORM_STATUS.md`;
- `ROCKSTAR_TECHNOLOGY_BASELINE.md`;
- `RESEARCH_PROTOCOL.md`;
- `../server/RUNTIME_REQUIREMENTS.md`;
- relevant roadmap entries and ADRs.

A routine run that finds no material change produces no repository change and no notification.

## Cadence

The external research watch runs every **6 hours**.

This cadence is intentionally frequent enough to catch meaningful Rockstar/Cfx.re platform changes while avoiding noise from continuously rechecking unchanged sources.

## Source policy

The watcher follows the source priority and evidence classes in `RESEARCH_PROTOCOL.md`.

Priority sources include:

1. Rockstar Games official product, support, legal, developer and engineering/careers material;
2. Cfx.re official documentation, support and announcements;
3. Take-Two first-party publications when directly relevant to GTA VI platform/runtime planning;
4. first-party platform-holder documentation when it materially affects supported platforms or integration constraints.

Watch-set additions, 2026-11-25 (research-repository layer, for discovery and change detection only — their content stays `PUBLIC_OBSERVED` or below):

- `TrinitronClient/GTA6-Asset-Info` (SixNG-team format spec; pin the reviewed revision when citing);
- `Ahmet-Dedeler/awesome-gta6-reverse-engineering` (ecosystem index; recheck before citing any project it lists);
- enforcement watch: new Take-Two DMCA takedowns or legal statements affecting reverse-engineering projects (record; assess citing-risk of affected repositories);
- the capability matrix [`GTA6_CAPABILITY_MATRIX_2026-11-25.md`](./GTA6_CAPABILITY_MATRIX_2026-11-25.md) is the canonical destination for engine-knowledge findings; the [uncertainty register](./UNCERTAINTY_REGISTER_2026-11-25.md) tracks what remains unknown.

High-quality secondary reporting may be used to locate a primary source, but it must not independently promote a GTA VI runtime claim to `CONFIRMED` when first-party evidence should exist.

Rumors, leaks, stolen/private material, unverifiable screenshots and speculative social posts are not implementation evidence.

## Change policy

When new legitimate evidence materially changes project knowledge, the watcher should:

1. compare the finding against the current `main` branch;
2. avoid duplicate or superseded automated research work;
3. create or reuse a short-lived research branch;
4. update only the canonical documents affected by the finding;
5. record the exact claim, source, publisher, publication/update date when available, verification date, evidence classification, limitations and project impact;
6. connect the finding to affected `RT-*`, roadmap or ADR entries;
7. open a focused pull request against `main`;
8. rely on the repository CI before integration.

The watcher must not create speculative GTA VI adapter code.

## Automatic merge boundary

A research pull request may be squash-merged automatically only when all of the following are true:

- the change is documentation-only;
- it does not promote a GTA VI runtime requirement to `CONFIRMED`;
- it does not introduce or change durable architecture;
- it does not materially reinterpret legal, monetization or security constraints;
- it contains legitimate public evidence under `RESEARCH_PROTOCOL.md`;
- the final pull-request head is current and CI is green.

A later watcher run may perform the merge after verifying those conditions.

## Mandatory human-review boundary

The watcher must leave the pull request open for review when a finding:

- promotes any `RT-*` requirement to `CONFIRMED` or `VALIDATED`;
- would unlock or materially change `adapters/gta6`;
- changes an architectural contract or requires a new ADR;
- changes the interpretation of Rockstar/Cfx.re policy, monetization, legal or security constraints;
- requires game-facing implementation code;
- depends on conflicting, incomplete or ambiguous first-party evidence.

In those cases, automation may prepare the evidence and documentation but must not make the architectural or implementation decision on its own.

## Notification policy

Notifications are signal-driven rather than run-driven.

Notify only when:

- a material verified change was found;
- a research PR was created or materially updated;
- a significant automated documentation PR was merged;
- a source conflict or ambiguity requires review;
- an `RT-*` requirement may be ready for promotion.

Do not notify merely because a scheduled check completed.

## Failure and stale-work handling

If an automated PR becomes stale because newer evidence supersedes it, update, close or replace it rather than stacking contradictory research PRs.

If CI fails, do not merge. Diagnose the repository change in the normal PR workflow and keep the evidence record intact.

If a first-party source disappears, do not silently delete the historical claim. Re-evaluate its current support, record the loss of source availability when material, and prefer a newer authoritative source when one exists.

## Design principle

The automation is allowed to keep knowledge current. It is not allowed to lower the threshold for knowledge to become an implementation contract.
