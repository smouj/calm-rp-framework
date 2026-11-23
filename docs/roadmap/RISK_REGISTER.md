# Project Risk Register

**State:** ACTIVE

This register tracks risks that can materially change the future GTA VI RP server plan.

It focuses on decisions and mitigations we control. Unknown external facts remain unknown rather than being assigned invented probabilities.

## R-001 — No authorized GTA VI community-server path appears

**Impact:** Critical

The project could not lawfully or practically bind its server domain to GTA VI in the planned way.

Mitigation:

- keep the domain, simulator, persistence and operations work game-agnostic;
- do not spend heavily on GTA VI-specific infrastructure before RT-001 is confirmed;
- preserve the option to reuse server-domain work in another authorized environment.

Trigger for reassessment: first-party Rockstar Games/Cfx.re policy or runtime announcement relevant to GTA VI community servers.

## R-002 — GTA VI integration differs substantially from FiveM/RedM

**Impact:** High

Assumed scripting languages, events, entity ownership or UI concepts could be wrong.

Mitigation:

- isolate Cfx research from GTA VI contracts;
- require evidence classification before runtime coupling;
- keep domain contracts neutral;
- maintain the explicit runtime requirements register.

Trigger for reassessment: any GTA VI-specific public developer/runtime documentation.

## R-003 — Platform availability blocks practical server development

**Impact:** High

The platforms or development/runtime environment initially available for GTA VI may not support the workflow expected by current PC community servers.

Mitigation:

- avoid selecting permanent hosting/tooling around an assumed PC runtime;
- keep simulator-driven development independent from game availability;
- treat host platform and development workflow as explicit blocked requirements.

Trigger for reassessment: verified platform/runtime availability relevant to custom community servers.

## R-004 — Policy or monetization constraints change the server design

**Impact:** High

Rockstar Games, Take-Two or Cfx.re policies may restrict branding, monetization, assets, integrations or server operation.

Mitigation:

- maintain first-party policy sources in platform research;
- keep project branding independent;
- avoid business-model assumptions before policy is verified;
- make monetization a policy-gated decision, not a technical default.

Trigger for reassessment: new or revised first-party RP/community-server policy.

## R-005 — Open-platform feature sprawl

**Impact:** High

A public FiveM-inspired vision may attract premature demands for plugin ABIs, hosting, marketplaces, network clients and compatibility layers before the project has verified domain functionality or game-runtime authorization.

Mitigation:

- follow the accepted ADR-0006 scope decision;
- require feature proposals to state a reusable, tested contributor or RP need;
- stabilize domain contracts only after simulator and security tests;
- keep conditional GTA VI-specific requirements blocked until first-party evidence.

Trigger for reassessment: a proven integration requirement, representative user need or reliable platform announcement.

## R-006 — Premature distributed architecture

**Impact:** Medium to high

Microservices, brokers and distributed consistency could add failure modes and operational cost before scale requires them.

Mitigation:

- enforce ADR-0003;
- require measured scaling/isolation evidence before service extraction;
- keep module boundaries explicit inside the monolith.

Trigger for reassessment: measured workload, isolation or availability requirement that cannot be handled cleanly in the current deployment model.

## R-007 — Economy or ownership exploits damage server integrity

**Impact:** Critical

Duplication, double-spend, forged ownership or privileged corrections could undermine the RP economy and player trust.

Mitigation:

- server-authoritative mutations;
- immutable financial ledger;
- idempotency and transactional concurrency controls;
- auditable staff corrections;
- threat-model review for valuable state changes.

Trigger for reassessment: new economy/ownership feature or exploit class.

## R-008 — Staff tooling becomes an authority bypass

**Impact:** High

Administrative convenience could bypass the same invariants enforced for players and create unaudited corruption.

Mitigation:

- capability-based staff permissions;
- domain-safe administrative commands;
- reason and actor attribution;
- no normal workflow based on ad-hoc database edits.

Trigger for reassessment: every new privileged staff operation.

## R-009 — Dependency/toolchain drift reduces reproducibility

**Impact:** Medium

Uncoordinated major upgrades or mutable build inputs can break CI or introduce supply-chain risk.

Mitigation:

- committed pnpm lockfile;
- frozen CI install;
- pinned GitHub Actions;
- grouped Dependabot maintenance;
- deliberate review of major toolchain changes and lifecycle scripts.

Trigger for reassessment: dependency security alert, supported-runtime change or planned major toolchain upgrade.

## R-010 — Backups exist but recovery fails

**Impact:** Critical

A production incident could expose that backups are incomplete, inaccessible or never tested.

Mitigation:

- define RPO/RTO before production;
- test restoration regularly;
- protect backup credentials and storage;
- treat successful restore verification as part of production readiness.

Trigger for reassessment: persistence topology change or failed restore exercise.

## R-011 — Official/proprietary branding creates affiliation or asset risk

**Impact:** Medium to high

Using official logos, artwork or presentation too closely could create confusion about affiliation and unnecessary IP risk.

Mitigation:

- use original project/community identity for repository and future server branding;
- treat official material as external research/reference unless rights permit redistribution;
- keep the independent-project notice visible where appropriate.

Trigger for reassessment: public branding/community launch or legal/policy guidance.

## R-012 — Documentation drifts from implementation

**Impact:** Medium

A planning-heavy repository can become misleading if documents stop reflecting code, runtime evidence or current decisions.

Mitigation:

- architecture guardrail tests for critical contracts;
- ADRs for durable changes;
- PR template evidence/scope checks;
- update platform status before GTA VI adapter work;
- remove or mark superseded documents instead of leaving contradictory guidance.

Trigger for reassessment: any architecture, runtime or source-of-truth change.

## R-013 — Private history exposed during publication

**Impact:** Critical

Changing repository visibility could expose prior commits, branches, issues, PR attachments or GitHub Actions logs that contain sensitive information or third-party content.

Mitigation:

- require the [public launch checklist](../community/PUBLIC_LAUNCH_CHECKLIST.md);
- audit historical data and job artifacts, not just current tracked files;
- rotate any secrets and publish a clean repository instead if the history cannot be safely sanitized;
- enable appropriate secret scanning, push protection and restricted merge permissions.

Trigger for reassessment: proposed visibility change or new sensitive finding.

## R-014 — Fan branding mistaken for authorized GTA VI support

**Impact:** High

Names, badges, logos or download descriptions could imply official endorsement, trademark permission, a working game client or an authorized third-party server.

Mitigation:

- apply [trademark and fan-project rules](../../TRADEMARKS.md);
- use original graphics and explicit non-affiliation wording;
- link official terms and distinguish a research goal from a supported runtime;
- require human review for any game-facing release or legal interpretation.

Trigger for reassessment: external launch, branding refresh, proposed game integration or policy update.

## Review rule

Review this register when a major roadmap gate changes, a new first-party GTA VI/Cfx.re fact appears, a production-readiness milestone is approached or a material incident invalidates an existing mitigation.

Do not manufacture numerical likelihood values for external GTA VI events without reliable evidence. The register exists to keep options and mitigations explicit, not to give uncertainty fake precision.
