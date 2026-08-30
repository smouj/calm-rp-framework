# Platform Research Protocol

**State:** ACTIVE

This protocol defines how GTA VI, Rockstar Games and Cfx.re information becomes project knowledge.

Its purpose is to prevent rumors, current FiveM behavior and implementation guesses from turning into accidental architecture contracts.

## Evidence classes

| Class | Meaning | May unlock GTA VI adapter work? |
| --- | --- | ---: |
| `CONFIRMED` | Public first-party Rockstar Games or Cfx.re documentation/announcement directly supports the claim | Yes, when sufficiently specific |
| `PUBLIC_OBSERVED` | Behavior can be observed in a current public ecosystem but is not a GTA VI guarantee | No |
| `INFERENCE` | Reasoned planning assumption based on available evidence | No |
| `RUMOR` | Unverified third-party claim | No |
| `UNKNOWN` | Information required by the project has not been publicly established | No |

`CONFIRMED` is about the specific claim, not the reputation of a source in general. A first-party statement about FiveM does not automatically confirm the same behavior for GTA VI.

## Source priority

Prefer sources in this order:

1. Rockstar Games official product/support/legal/developer material.
2. Cfx.re official documentation, support or announcements.
3. First-party platform-holder documentation when directly relevant.
4. Publicly observable behavior in currently supported products, classified as `PUBLIC_OBSERVED`.
5. High-quality secondary reporting only as a pointer to primary evidence.

Secondary reporting alone should not move an integration requirement to `CONFIRMED` when primary documentation should reasonably exist.

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

## Review cadence

`PLATFORM_STATUS.md` should be reviewed whenever any of these occur:

- Rockstar Games publishes material relevant to GTA VI online/community servers;
- Cfx.re announces a GTA VI-related runtime or policy change;
- a platform requirement blocks planned work;
- the project is about to start GTA VI adapter implementation;
- an existing confirmed source is materially updated or removed.

Routine reviews should change nothing when there is no new evidence. The goal is accuracy, not activity.
