# Platform Research Protocol

**State:** ACTIVE

This protocol defines how GTA VI, Rockstar Games and Cfx.re information becomes project knowledge.

Its purpose is to prevent rumors, current FiveM behavior and implementation guesses from turning into accidental architecture contracts.

## Evidence classes

| Class             | Meaning                                                                                            | May unlock GTA VI adapter work? |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------------------: |
| `CONFIRMED`       | Public first-party Rockstar Games or Cfx.re documentation/announcement directly supports the claim | Yes, when sufficiently specific |
| `PUBLIC_OBSERVED` | Behavior can be observed in a current public ecosystem but is not a GTA VI guarantee               |                              No |
| `INFERENCE`       | Reasoned planning assumption based on available evidence                                           |                              No |
| `RUMOR`           | Unverified third-party claim                                                                       |                              No |
| `UNKNOWN`         | Information required by the project has not been publicly established                              |                              No |

`CONFIRMED` is about the specific claim, not the reputation of a source in general. A first-party statement about FiveM, a Rockstar engineering role or a current internal technology practice does not automatically confirm the same behavior for GTA VI.

## Source priority

Prefer sources in this order:

1. Rockstar Games official product/support/legal/developer material.
2. Cfx.re official documentation, support or announcements.
3. Rockstar Games official engineering/careers material when the claim concerns current technology practice rather than a GTA VI product contract.
4. First-party platform-holder documentation when directly relevant.
5. Publicly observable behavior in currently supported products, classified as `PUBLIC_OBSERVED`.
6. High-quality secondary reporting only as a pointer to primary evidence.

Secondary reporting alone should not move an integration requirement to `CONFIRMED` when primary documentation should reasonably exist.

### Careers and engineering-role evidence

Official Rockstar job descriptions are admissible first-party evidence for narrowly scoped statements such as:

- technologies currently used by a named Rockstar engineering discipline;
- engineering responsibilities described by Rockstar;
- languages or platforms explicitly required by the role.

They are **not** sufficient by themselves to confirm:

- the complete implementation stack of GTA VI;
- a GTA VI community-server API;
- a GTA VI scripting runtime;
- the exact language used by a particular unreleased subsystem unless the posting explicitly says so.

Because job pages can change or disappear, research based on them must record the exact claim, URL and verification date. When possible, corroborate a material architectural inference with more than one independent first-party signal.

## Required research record

A material platform finding must record:

- subject/capability;
- evidence classification;
- exact claim supported;
- what the source does **not** establish;
- source URL and publisher;
- publication/update date when available;
- verification date;
- project impact;
- remaining unknowns;
- affected roadmap gate, ADR or runtime requirement.

Use the repository's `Platform research` issue form for work that needs discussion or follow-up.

## Autonomous research execution

The project maintains an external autonomous research watch defined in [`AUTONOMOUS_RESEARCH.md`](./AUTONOMOUS_RESEARCH.md).

The watcher periodically evaluates first-party Rockstar/Cfx.re and directly relevant platform sources against the current `main` branch. Automation must follow the same evidence classes, source priority and promotion rules as manual research.

Automation is allowed to:

- detect material new evidence;
- update canonical research documentation on a short-lived branch;
- open a focused pull request;
- merge low-risk documentation-only research updates after CI is green when the autonomous merge boundary is satisfied.

Automation is not allowed to:

- promote rumors or leaked material into implementation evidence;
- implement speculative GTA VI adapter code;
- automatically merge a change that promotes a runtime requirement, changes durable architecture or materially changes legal, monetization or security interpretation.

A scheduled check that finds no material change should create no commit, PR or notification.

## Promotion rule

A finding may move from `UNKNOWN`, `RUMOR`, `INFERENCE` or `PUBLIC_OBSERVED` to `CONFIRMED` only when a public source directly supports the relevant GTA VI/runtime claim.

When promoting a finding:

1. update `PLATFORM_STATUS.md`;
2. record the verification date;
3. update `server/RUNTIME_REQUIREMENTS.md` if a blocked requirement changes state;
4. create/update an ADR before introducing durable runtime coupling;
5. add adapter conformance tests before claiming implementation support.

## Contradictions and changed information

When newer first-party information contradicts an older source:

- keep the current statement accurate;
- retain enough history in Git to explain the change;
- cite the newer source;
- update affected requirements and ADRs;
- do not preserve obsolete behavior merely for consistency with an older plan.

If sources conflict without a clear authoritative resolution, classify the requirement as `UNKNOWN` and document the conflict.

## Rumors, leaks and reverse engineering

Leaked material, private services, stolen data, unverifiable screenshots and reverse-engineered private Rockstar infrastructure must not become implementation dependencies in this project.

Public discussion of leaked material may identify a research question, but the project must independently resolve that question through legitimate public evidence before using it as a technical premise. If a leaked claim is later publicly documented by Rockstar Games or Cfx.re, cite the legitimate public source rather than the leak.

Public reverse engineering of our own abstract interfaces or simulator behavior is unrelated; the restriction concerns non-public game/platform contracts that would create unsupported coupling or legal/security risk.

## Current-ecosystem research

FiveM/RedM can be studied for architectural patterns such as:

- server authority;
- event validation;
- entity ownership concerns;
- scripting/resource boundaries;
- operational practices;
- permission models;
- common exploit classes.

Those observations belong in the Cfx research boundary and remain `PUBLIC_OBSERVED` unless GTA VI-specific documentation independently confirms them.

Current Rockstar/Cfx technology evidence that informs language strategy without proving a GTA VI runtime belongs in `ROCKSTAR_TECHNOLOGY_BASELINE.md`.

## Execution research must remain separate from runtime capability claims

Experimental PC execution and Xbox compatibility layers may reveal architectural dependencies, but they do not supply an authorized GTA VI community-server API. The [2026-11-26 evidence-to-contract mapping](./GTA6_EXECUTION_TO_RP_CONTRACTS_2026-11-26.md) records these distinctions and the exact public repository commits examined. Do not promote an `RT-*` requirement merely because an offline executable reaches a world scene.

## Review cadence

`PLATFORM_STATUS.md` and material technology evidence should be reviewed whenever any of these occur:

- the autonomous research watch detects a material first-party change;
- Rockstar Games publishes material relevant to GTA VI online/community servers;
- Cfx.re announces a GTA VI-related runtime or policy change;
- Rockstar publishes a materially relevant engineering/runtime statement;
- a platform requirement blocks planned work;
- the project is about to start GTA VI adapter implementation;
- an existing confirmed source is materially updated or removed.

Routine reviews should change nothing when there is no new evidence. The goal is accuracy, not activity.
