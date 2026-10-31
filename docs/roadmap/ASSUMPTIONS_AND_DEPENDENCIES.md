# Risk, Assumptions and External Dependencies Map

**State:** ACTIVE — planning and evidence map; not a GTA VI runtime specification  
**Reviewed:** 2026-10-31  
**Repository baseline examined:** `main` at `7cb61bd4b25d666c327648277a8a17645f703f4a` (2026-09-12)  
**Decision authority:** [Risk register](./RISK_REGISTER.md), [runtime requirements](../server/RUNTIME_REQUIREMENTS.md), [platform status](../research/PLATFORM_STATUS.md), and accepted [ADRs](../adr/)

## Reading rules

This map separates four different things:

- **Confirmed external fact:** narrowly supported by a first-party source, with product and date scope stated. A fact about GTA V, FiveM, RedM, the Rockstar Games Launcher, or Cfx operations is **not** a GTA VI runtime fact.
- **Hypothesis / `INFERENCE`:** a useful proposition to test; it is neither an approved dependency nor permission to implement an adapter.
- **External dependency / `UNKNOWN`:** something only the platform owner or an authorized runtime can establish. Work requiring it remains blocked regardless of internal readiness.
- **Internal design decision:** a project choice governed by scope or an ADR, not a claim about Rockstar's implementation. Reversible means **changeable with a known cost and review gate**, not free to change without review.

Evidence classification follows [RESEARCH_PROTOCOL.md](../research/RESEARCH_PROTOCOL.md). Requirement states (`UNKNOWN`, `PARTIAL`, `CONFIRMED`, `VALIDATED`) follow [RUNTIME_REQUIREMENTS.md](../server/RUNTIME_REQUIREMENTS.md). No risk probability or GTA VI compatibility percentage is implied.

## 1. Confirmed facts with bounded scope

| ID | Confirmed claim and scope | Source / observation | Does **not** confirm |
| --- | --- | --- | --- |
| F-01 | Rockstar lists GTA VI for **2026-11-19 on PS5 and Xbox Series X\|S** (checked 2026-10-31). | [GTA VI official page](https://www.rockstargames.com/VI); [2026-10-15 announcement](https://www.rockstargames.com/newswire/article/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer) | PC availability, GTA VI multiplayer, a community-server runtime, or RP support. |
| F-02 | The currently documented GTA VI product was explicitly described as a **single-player experience** by Rockstar (2026-06-24). | [Rockstar pre-order announcement](https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25); [platform status](../research/PLATFORM_STATUS.md) | That multiplayer or online services can never be announced later. |
| F-03 | Rockstar documents authorized **current** RP/community servers through the Cfx/FXServer path; the scope of currently covered games must be checked against the applicable license. | [Rockstar authorized services notice](https://support.rockstargames.com/articles/LqoRbLhB9zJsqWt8LQFTK/i-found-an-unofficial-gta-multiplayer-server-will-i-get-in-trouble-for-playing-on-or-hosting-one-of-these-servers) | That GTA VI is a covered or authorized game. |
| F-04 | Rockstar's 2026-09-03 Launcher release notes explicitly mention **FiveM interoperability** (page last updated 2026-10-02). | [Launcher update 1.0.109.3031](https://support.rockstargames.com/articles/2N4ztI3jnLAEP77euIvhBD/rockstar-games-launcher-update-1-0-109-3031-notes) | Any GTA VI launcher requirement, protocol, adapter, or compatibility guarantee. |
| F-05 | Rockstar's public service-status page exposes separate **Cfx authentication, FiveM, RedM, community-server, and marketplace** components. This is an operational status surface, not a service contract. | [Rockstar service status](https://support.rockstargames.com/servicestatus) (checked 2026-10-31) | GTA VI use of those components, an SLA, an API, or a future component taxonomy. |
| F-06 | Rockstar's RP policy page (updated **2026-09-15**) refers to the **Creator Platform License Agreement** (updated **2026-09-10**). The agreement conditions Creator Services on authorized **Covered Games**. | [RP policies](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers); [Creator Platform License Agreement](https://fivem.net/terms), §§1.1–1.3 | That GTA VI is licensed for custom servers or that present monetization/branding rules may be applied to a hypothetical GTA VI product without review. |

**Source freshness caveat:** this is a targeted 2026-10-31 source check, not a complete re-audit of every link in the September technology matrix. The [platform status](../research/PLATFORM_STATUS.md) remains the canonical claim-by-claim record. A monitored service being healthy at one instant establishes no future uptime.

## 2. Hypotheses (not implementation facts)

| ID | Planning hypothesis | Classification | Exposure if wrong | Safe test or response | Connected risks |
| --- | --- | --- | --- | --- | --- |
| H-01 | An authorized GTA VI community-server path may eventually be offered. | `INFERENCE` | The intended product cannot integrate with GTA VI. | Keep the simulator and core independently valuable; do not fund a GTA VI-specific deployment. | R-001, R-003 |
| H-02 | Some current Cfx concepts may be useful as *design patterns*. | `INFERENCE` | Native/event/sync abstractions will not map to GTA VI. | Isolate experiments in `adapters/cfx`; never copy public FiveM signatures into shared contracts. | R-002, R-013 |
| H-03 | A TypeScript, authoritative domain behind ports can survive a different future runtime. | `INFERENCE` about portability; **accepted internal architecture** under ADR-0001 | Translation or process boundaries may cost more than expected. | Prove behavior in deterministic simulator tests; defer bridge technology and benchmark later. | R-002, R-006 |
| H-04 | External identity, session, and event delivery can be translated to internal identities and commands. | `INFERENCE` | Account takeover, replay, loss of ordering, or incorrect session linkage. | Define *internal* security invariants; implement no external ID format or auth bridge before RT-005/006/010 evidence. | R-007, R-008 |
| H-05 | A modular monolith and PostgreSQL will suffice for the first measured workload. | Internal design hypothesis under ADR-0003/0004 | Rework if observed latency/scale/hosting constraints demand extraction. | Test with simulator workload; retain migration, service-extraction, and operational review paths. | R-006, R-010 |
| H-06 | Current Cfx status and launcher integration justify separate health/compatibility *interfaces* for a future adapter. | `INFERENCE` | False availability indicators or unnecessary dependency coupling. | Model optional dependency health generically; do not hard-code Cfx endpoint names in the GTA VI adapter. | R-013, R-014, R-015 |

A hypothesis stays a hypothesis even if it sounds plausible, is widespread in the community, or is supported indirectly by leaked/unauthorized information.

## 3. External dependencies and evidence gates

Every `RT-*` row remains `UNKNOWN` in the current repository runtime register. The groups below are scheduling and evidence dependencies, **not** replacements for the individual requirements.

| Gate | External dependency | Traced requirements | Required evidence before implementation | Decision blocked |
| --- | --- | --- | --- | --- |
| E-01 **HARD STOP** | GTA VI explicitly authorized for a legitimate community-server/creator runtime, including actual covered-game scope. | RT-001, RT-021 | GTA VI-specific Rockstar/Cfx first-party authorization, applicable licensing and permitted server operation. Human policy review. | Any real GTA VI server/adapter integration, public launch, monetization. |
| E-02 | Supported host/platform, distribution, developer lifecycle and testing access. | RT-002, RT-022 | Authorized server tooling, OS/runtime lifecycle, distributions and reproducible development instructions. | Hosting provider/OS, deployment topology, real integration CI. |
| E-03 | Server/client execution and message model. | RT-003, RT-004, RT-006, RT-007, RT-010 | Versioned GTA VI-specific scripting/API documentation for events, payloads, trust boundaries and connection handling. | Adapter language, event bridge, session handlers, binary/runtime bindings. |
| E-04 | Authentication, entitlement and stable player identity. | RT-005, RT-019 | Official identity contract, identifier lifetime, entitlement and security limits, token/session handling. | Production authentication binding and persistence of external identifiers. |
| E-05 | Game entities, replication, character/vehicle/property/world interaction. | RT-008, RT-009, RT-011–RT-014 | Supported server authority, entity ownership, replication/update semantics and domain-relevant operations. | Spawning, entity controls, world ownership projection, gameplay hooks. |
| E-06 | Game-facing presentation and communication. | RT-015, RT-016 | Supported UI and voice interfaces, permissions, capabilities and supported deployment path. | NUI/web-view and voice integrations. |
| E-07 | Assets, administration, anti-cheat and version compatibility. | RT-017–RT-020 | Documented resource packaging, privileged runtime hooks, security model and upgrade/compatibility contract. | Runtime admin hooks, resource delivery, production rollout matrix. |
| E-08 | Current and future Creator Platform policy and legal/commercial eligibility. | RT-021, alongside RT-001 | Human assessment of applicable current terms, covered-game list, branding, content licensing, privacy, monetization and any future GTA VI-specific terms. | Payment design, public branding, assets, storefronts, commercial server operation. |
| E-09 | External auth/runtime/service availability and service-level behavior. | RT-005, RT-020, RT-022 when applicable | GTA VI-specific dependency list, supported status/health mechanism, retry/backoff/rate limits and failure semantics. | Hard-coded Cfx/launcher dependencies, uptime claims, operational alert thresholds. |

**Minimum adapter gate:** do not advance P5 until RT-001/003/005/006/007/010 and sufficient RT-008/009 are specifically confirmed, with RT-002/022 providing a legitimate reproducible test path. For each capability, follow `UNKNOWN → CONFIRMED → VALIDATED` (or `PARTIAL` when genuinely justified); validation requires a real authorized runtime and conformance tests. Domain/simulator progress cannot substitute for external confirmation.

## 4. Reversibility of architectural decisions

| Choice | State and owner | Reversibility / migration cost | Safe to do now | Evidence or review required to change/bind |
| --- | --- | --- | --- | --- |
| Game-agnostic core + adapters | **Accepted** ADR-0001 | **Medium–high** once many domain contracts depend on the boundary; retain now. | Contracts, simulator, adapter-neutral tests. | New ADR + conformance evidence for any runtime-facing exception. |
| Own-server product, not public framework | **Accepted** ADR-0002 | **High strategic** cost if public APIs/products later added. | Focused server blueprint and use cases. | Scope approval and ADR, actual internal reuse before extraction. |
| Modular monolith before distributed services | **Accepted** ADR-0003 | **Medium**: extraction possible, but cross-service transactions/operations are costly. | Module isolation and measured simulator load tests. | Real scale/isolation or platform constraints plus ADR. |
| PostgreSQL authoritative, Redis disposable | **Accepted** ADR-0004 | **High** for replacing durable store/ledger; **low** for optional cache. | Migrations, transactions, audit and restore exercises. | Data migration/recovery ADR for another authoritative store; metrics for Redis. |
| TypeScript for internal domain and tooling | Current internal implementation choice | **Medium**: language port is possible but expensive as code grows. | Build domain-only vertical slices and tests. | Benchmark/evidence before requiring a particular future bridge or rewriting the core. |
| Simulator and isolated public Cfx lab | Current boundaries | **Low** for experiments; no GTA VI contract. | Simulator tests and public Cfx research. | Any promotion into shared/runtime contracts requires GTA VI-specific evidence. |
| GTA VI adapter implementation and bridge language | **Not selected / BLOCKED** | **Maximally reversible while deferred**; becomes costly after native binding. | Placeholder/interface planning only. | E-01–E-04 minimum, ADR and versioned conformance tests. |
| Hosting OS, scaling, launcher/identity binding, asset/UI/voice stack | **Not selected / BLOCKED** | **Low now**, potentially **high later** due provider and platform lock-in. | Requirements, generic health ports and simulator-only staging. | Applicable E-02–E-09 evidence, feature-specific ADR and security/legal review. |
| Economy and admin authority invariants | **Accepted security constraints** | **Intentionally costly to relax**: integrity requirements, not a convenience feature. | Idempotency, ledger/audit, access-control tests. | Threat-model review and migration/incident safety analysis. |

**Important distinction:** postponing a decision is itself valuable reversibility. Do not invent an implementation to make a blocked requirement appear complete.

## 5. Implementation readiness by workstream

| Workstream | Current disposition | Minimum next proof |
| --- | --- | --- |
| P0–P1: scope, source tracking, community rules | **Proceed**, governed by existing documents. | Specific policy decisions and source freshness; policy changes require human review. |
| P2: domain commands, identity model without external IDs, ledger, inventory, permissions, audit, simulator | **Proceed** within game-agnostic boundaries. | Deterministic multi-actor tests, transactional invariants and reproducible CI. |
| P2/P3: database operations and recovery | **Proceed cautiously**; no production claims. | Migration tests, restore drill, explicit RPO/RTO before production. |
| P3: vehicle/property/EMS/police rules | **Proceed only for justified domain slices**. | Approved blueprint and tests; game-facing operations remain blocked. |
| P4: FiveM/RedM experimentation | **Research only**. | Public Cfx documentation and clear isolation; no inherited GTA VI assumptions. |
| P5: authorized GTA VI adapter and deployment | **BLOCKED**. | E-01–E-04 and relevant E-05 evidence; documented versions, ADRs, conformance tests. |
| P6–P7: production server and monetization | **BLOCKED**. | P5 validation, E-07/E-08 review, threat and legal review, tested recovery and operations. |

## 6. Review and escalation

1. New first-party GTA VI/Cfx information: record exact product scope, date, URL, supported claim, exclusions and affected `RT-*` rows in [PLATFORM_STATUS.md](../research/PLATFORM_STATUS.md). Revisit risks R-001–R-004, R-013–R-015; **do not** promote runtime states by analogy.
2. Creator Platform agreement, allowed-game or monetization change: pause affected commercial/branding decisions; review F-06/E-01/E-08 and R-004 **with a human**. A currently covered game is not evidence GTA VI is covered.
3. Launcher/Cfx status or compatibility change: use it for present-ecosystem monitoring/research only. Review H-06, E-09 and R-014/R-015 without unlocking the adapter.
4. New architecture coupling, authoritative data store or privilege change: require an ADR, threat-model check, migrations and tests as applicable.
5. Keep autonomous research rules in [AUTONOMOUS_RESEARCH.md](../research/AUTONOMOUS_RESEARCH.md): documentation-only factual maintenance may be automated within its limits; **runtime promotion, architecture, legal and security decisions are review-only**.

**Next review:** upon a material first-party change or before any P5 decision. A routine check with no changed evidence must not create artificial progress.
