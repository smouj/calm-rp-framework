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

## Cadence and execution

A **daily ChatGPT research task** was configured on **2026-11-25**, scheduled around **08:00 Europe/Madrid** (flexible local-time scheduling, first due 2026-11-26). This is an **external scheduled assistant task**, not a GitHub Actions cron job. Its actual future tool permissions, execution, and GitHub writes must be verified from each run's results; this document does not guarantee an update has been deployed.

The daily task checks for meaningful developments since the previous review and compares them against the current `main`. It creates no commits or alerts just to record an unchanged daily check.

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

Additional directly relevant public implementation sources (source-owner claims only; `PUBLIC_OBSERVED` or lower):

- **[Marvisak/VIctory](https://github.com/Marvisak/VIctory):** console compatibility architecture, public interfaces, releases and licensing; offline compatibility layer, not a GTA VI RP SDK.
- **[fxceless/victory-fork](https://github.com/fxceless/victory-fork):** public technical fixes and documentation; rendering progress does not imply game scripting.
- **[myokex/victory-amd](https://github.com/myokex/victory-amd/tree/victory-amd):** AMD graphics, texture and memory fixes on branch `victory-amd`; baseline [`070df424b096`](https://github.com/myokex/victory-amd/commit/070df424b0967dca422478a1f12afaaf6736ebdd), reviewed 2026-11-25. Developer-reported one-machine results; offline by design; GPL-3.0-or-later.
- **[xcl-dev/xcl](https://github.com/xcl-dev/xcl):** platform compatibility and runtime behavior; no GTA VI resource or server API established.
- **[holdmysocks/SixNG](https://github.com/holdmysocks/SixNG):** resource format research and provenance; offline tooling only.
- **[Ahmet-Dedeler/rage9-re](https://github.com/Ahmet-Dedeler/rage9-re):** public data-format readers; serialized data is not a native API.
- **ESX Legacy, QBCore and Qbox official code and docs:** publicly documented RP contract changes, deprecations and modular patterns; GTA V ecosystem only; inspect license before reuse.

Watch higher-impact changes before performance claims: GTA VI-specific *authorized* runtime/creator announcements, published client-server API contracts, resource packaging, entity ownership, security policy, platform version requirements, licensing, or evidence that changes CALM's documented assumptions. Plain FPS gains, stars, tracker rankings, routine refactors or unreproducible leaks are **not** sufficient for a repository change.

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
8. rely on the repository CI before integration; if CI cannot execute, remains pending or reports ambiguous status, leave the PR open;
9. report the PR URL and verification status to the maintainer, without claiming a merge or successful execution unless GitHub confirms it.

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
