# Project Risk Register

**State:** ACTIVE  
**Last reviewed:** 2026-10-31 (repository baseline: 2026-09-12; targeted first-party source check: 2026-10-31)

See [ASSUMPTIONS_AND_DEPENDENCIES.md](./ASSUMPTIONS_AND_DEPENDENCIES.md) for traceable confirmed facts, hypotheses, external evidence gates and the reversibility of accepted versus deferred decisions.

This register tracks risks that can materially change the future GTA VI RP server plan.

It focuses on decisions and mitigations we control. Unknown external facts remain unknown rather than being assigned invented probabilities.

## Risk posture and ownership

- **External blockers (not our delivery failures):** R-001–R-004. No GTA VI community-server permission, PC/host toolchain or real runtime API is currently established in the project's GTA VI requirements register. Rockstar's current GTAV/Cfx tooling, Launcher integration and service status do not remove these blockers.
- **Architecture/implementation control:** R-005–R-009, R-012, R-013. Keep the simulator authoritative, experiments isolated, and architectural decisions traceable to ADRs.
- **Production/security control:** R-007, R-008, R-010, R-014, R-015. Recovery, permissions, dependency health and compatibility must be _demonstrated_ before shipping.

**Priority review:** R-001 (authorization), R-002 (runtime mismatch), R-003 (host/toolchain availability), R-004 (license/policy), R-007 (economic integrity), R-010 (recovery). These priorities reflect consequences and blocking dependencies, not fabricated likelihoods. An accepted ADR is an internal design decision, not a GTA VI capability claim.

## R-001 — No authorized GTA VI community-server path appears

**Impact:** Critical

The project could not lawfully or practically bind its server domain to GTA VI in the planned way.

Mitigation:

- keep the domain, simulator, persistence and operations work game-agnostic;
- do not spend heavily on GTA VI-specific infrastructure before RT-001 is confirmed;
- preserve the option to reuse server-domain work in another authorized environment.

Trigger for reassessment: first-party **GTA VI-specific** covered-game authorization and community-server/runtime terms (E-01, RT-001/021). Current Creator Platform authorization for other games is insufficient.

## R-002 — GTA VI integration differs substantially from FiveM/RedM

**Impact:** High

Assumed scripting languages, events, entity ownership or UI concepts could be wrong.

Mitigation:

- isolate Cfx research from GTA VI contracts;
- require evidence classification before runtime coupling;
- keep domain contracts neutral;
- maintain the explicit runtime requirements register.

Trigger for reassessment: GTA VI-specific public developer/runtime contracts for scripting, events, identity and entity/sync semantics (E-03–E-05; RT-003–RT-010).

## R-003 — Platform availability blocks practical server development

**Impact:** High

The platforms or development/runtime environment initially available for GTA VI may not support the workflow expected by current PC community servers.

Mitigation:

- avoid selecting permanent hosting/tooling around an assumed PC runtime;
- keep simulator-driven development independent from game availability;
- treat host platform and development workflow as explicit blocked requirements.

Trigger for reassessment: verified GTA VI community-server host OS, binary distribution and reproducible developer access (E-02; RT-002/022). Announced console game availability does not imply a PC server toolchain.

## R-004 — Policy or monetization constraints change the server design

**Impact:** High

Rockstar Games, Take-Two or Cfx.re policies may restrict covered games, branding, monetization, assets, integrations, third-party services or server operation. The Rockstar RP policy page was updated 2026-09-15 and points to a Creator Platform License Agreement dated 2026-09-10. Its _Covered Games_ condition does not itself authorize GTA VI.

Mitigation:

- track the [RP policy page](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers) and [Creator Platform License Agreement](https://fivem.net/terms), including dates and applicable game scope;
- require human legal/policy review of licensing, server/operator obligations, monetization, branding and asset rights before public/commercial commitments;
- keep branding independent, keep payment integrations deferred and do not infer GTA VI rights from FiveM/RedM;
- treat policy reviews as blocking E-01/E-08 (RT-001/021), not as automatically merged research changes.

Trigger for reassessment: revised covered-game list, Rockstar/Cfx policy/license text, commercial/marketplace policy or GTA VI-specific authorization.

## R-005 — Premature framework/platform scope

**Impact:** High

Building extension systems, plugin APIs, hosting features or public framework compatibility could consume effort without helping our own server.

Mitigation:

- enforce ADR-0002;
- require feature proposals to state the server need;
- extract reusable components only after proven internal use.

Trigger for reassessment: concrete need to distribute a proven component externally.

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

Trigger for reassessment: any architecture, runtime or source-of-truth change, or a source updated after the repository's last verified snapshot. Cross-check this register against the assumptions map and RT states.

## R-013 — Current FiveM/Cfx evidence is promoted into a fictional GTA VI contract

**Impact:** High

First-party Launcher interoperability, Rockstar-supported GTAV RP distribution or operational Cfx service components may be mistaken for proof of GTA VI SDK support. This can create incorrect dependencies, misleading readiness claims and unnecessary adapter rework.

Mitigation:

- preserve product scope in every claim; label current-ecosystem evidence as current-ecosystem evidence;
- keep `adapters/cfx` separate from `adapters/gta6`;
- reject GTA VI adapter changes without first-party GTA VI runtime evidence, matching `RT-*` entries, an ADR and conformance tests;
- keep platform health, resource distribution and launcher names out of game-agnostic domain contracts.

Trigger for reassessment: explicit first-party GTA VI community-runtime/launcher/API documentation, not a current GTAV/Cfx status update (H-02/H-06; E-03/E-09).

## R-014 — External authentication or creator-service outages become server outages

**Impact:** High

A future authorized runtime may rely on authentication, distribution or runtime services beyond our control. Existing Cfx status components are evidence of _current_ operational surfaces, not proof of a GTA VI dependency list or service-level guarantees.

Mitigation:

- model dependency health, timeouts and degraded-mode policy generically;
- keep valuable mutations fail-closed on lost identity/authorization;
- make reconnect and command replay idempotent, while preserving durable state in PostgreSQL;
- define and test concrete availability/incident procedures only after the authorized runtime identifies its real dependencies.

Trigger for reassessment: verified GTA VI dependency graph, failure semantics and supported status/health mechanisms (E-04/E-09; RT-005/020/022).

## R-015 — Runtime, launcher or resource-version drift breaks future integration

**Impact:** High

An evolving game, launcher, creator runtime and adapter may become incompatible independently. Rockstar's FiveM interoperability release notes establish that current launcher compatibility requires maintenance, not that GTA VI inherits the same protocol.

Mitigation:

- reserve separate game/runtime/launcher/adapter version dimensions in _future_ compatibility documentation;
- keep deployments and migrations reversible where possible; use staging and conformance tests before promotion;
- do not pin a GTA VI launcher version, resource manifest or bridge implementation before documentation exists;
- require an explicit update/rollback/forward-fix policy for each confirmed adapter capability.

Trigger for reassessment: a versioned GTA VI runtime/launcher contract or a confirmed breaking change in a supported dependency (E-07/E-09; RT-017/020/022).

## Review rule

Review this register when a major roadmap gate changes, a new first-party GTA VI/Cfx.re fact appears, a Creator Platform license changes, a production-readiness milestone is approached or a material incident invalidates an existing mitigation. Keep [ASSUMPTIONS_AND_DEPENDENCIES.md](./ASSUMPTIONS_AND_DEPENDENCIES.md) and the runtime register consistent. Policy interpretation, security and durable architecture changes require human review under [AUTONOMOUS_RESEARCH.md](../research/AUTONOMOUS_RESEARCH.md).

Do not manufacture numerical likelihood values for external GTA VI events without reliable evidence. The register exists to keep options and mitigations explicit, not to give uncertainty fake precision.
