# Threat Model

**State:** ACTIVE

This threat model covers CALM's GTA VI-targeted RP services, persistence boundary and any future authorized runtime adapter.

It does not claim a GTA VI anti-cheat design before a legitimate runtime exists.

## Security objectives

1. Persistent RP state can only change through authorized server-side use cases.
2. Valuable mutations are replay-safe, transactional and auditable.
3. Compromise of a client, cache or transient runtime entity cannot directly mint canonical state.
4. Staff powers are explicit, least-privilege and attributable.
5. Runtime integration failures fail closed around valuable state.
6. Secrets and production data remain outside source control and untrusted clients.

## Assets to protect

| Asset                      | Primary integrity concern                  | Primary confidentiality concern              |
| -------------------------- | ------------------------------------------ | -------------------------------------------- |
| Account/session mapping    | account takeover, identifier substitution  | authentication/session material              |
| Character state            | forged progression or identity changes     | player metadata                              |
| Economy ledger             | money creation, deletion or double-spend   | transaction history where sensitive          |
| Inventory/ownership        | duplication, forged ownership transfer     | evidence/contraband metadata where sensitive |
| Jobs/factions/permissions  | rank escalation                            | internal/staff role data                     |
| Justice/moderation records | deletion or fabricated sanctions           | staff notes and sensitive case data          |
| Server configuration       | unauthorized gameplay/economy rule changes | secrets embedded by mistake                  |
| Audit history              | tampering or omission                      | operational/security context                 |
| Backups                    | corruption or untested restore             | complete durable dataset exposure            |

## Trust boundaries

### TB-01 — Game/UI client to runtime/server

Always untrusted. Inputs may be forged, reordered, replayed, spammed or modified by a compromised client.

### TB-02 — Runtime adapter to application/domain

Adapter-normalized data is still untrusted until application authentication, authorization and domain validation complete.

### TB-03 — Public/internal API to application

Authentication identifies a caller; it does not make request fields trustworthy.

**Current F1 implementation boundary:** the HTTP process is loopback-only and has a fixed,
server-configured operator bootstrap identity. It issues a short-lived session with only the
`economy.grant` capability. The request cannot choose the account or capabilities. There is no
public player login, external identity-provider integration, remote listener or GTA VI runtime
adapter. This bootstrap is for local operator workflows and must not be exposed through an Internet
proxy.

### TB-04 — Application to PostgreSQL

Privileged durability boundary. Queries must be parameterized and transactions must preserve domain invariants.

### TB-05 — Application to Redis/cache

Non-authoritative boundary. Cache loss or compromise must not create money, inventory, ownership or permissions.

### TB-06 — Staff tools to privileged application commands

High-risk boundary. Staff authority must be explicit, scoped and audited separately from in-character roles.

### TB-07 — CI/dependency supply chain to repository/runtime

Third-party packages and automation can execute during development/build workflows. Versions, build scripts and Actions require review.

## Threat catalogue

| ID    | Threat                       | Example                                                  | Required mitigation                                                                     |
| ----- | ---------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| T-001 | Client-forged state mutation | client sends a desired balance or rank                   | accept intent only; calculate/authorize server-side                                     |
| T-002 | Replay                       | repeat purchase/reward request                           | idempotency key or domain replay protection                                             |
| T-003 | Double-spend/race            | concurrent purchases spend the same funds                | transactional locking/concurrency invariant                                             |
| T-004 | Inventory duplication        | retry transfers the same item twice                      | atomic ownership transfer + idempotency                                                 |
| T-005 | Privilege escalation         | client supplies staff/job grade                          | server-owned role membership and permission checks                                      |
| T-006 | Identifier spoofing          | claim another character/account identifier               | bind runtime identity to authenticated server session                                   |
| T-007 | Mass event abuse             | spam expensive commands/events                           | rate limit, quotas, cheap rejection before heavy work                                   |
| T-008 | Injection                    | malicious input reaches SQL/command/template context     | parameterization, strict parsing, context-safe APIs                                     |
| T-009 | Session theft/reuse          | stolen token reused after expected invalidation          | bounded sessions, revocation strategy, secure storage                                   |
| T-010 | Staff abuse                  | unauthorized grant/ban/economy correction                | least privilege, reason required, immutable audit trail                                 |
| T-011 | Cache authority drift        | stale Redis value treated as canonical balance           | PostgreSQL/domain remains source of truth                                               |
| T-012 | Partial transaction failure  | money removed but ownership not granted                  | atomic transaction or compensating state machine                                        |
| T-013 | Runtime/entity spoofing      | fake entity ownership used to claim durable asset        | map transient entities to server-owned durable records                                  |
| T-014 | Migration corruption         | incompatible schema change loses state                   | reviewed migrations, staging exercise, verified backup                                  |
| T-015 | Secret exposure              | production credentials committed/logged                  | external secret management, scanning, log redaction                                     |
| T-016 | Supply-chain compromise      | mutable Action/container tag or malicious package script | pinned Actions and image digests, reviewed lockfile/build scripts, least CI permissions |
| T-017 | Audit evasion                | privileged mutation leaves no trail                      | audit event in same authoritative use-case path                                         |
| T-018 | Resource exhaustion          | expensive search/query invoked repeatedly                | bounded inputs, pagination, timeouts, rate limits                                       |

## Mutation security pattern

Valuable state changes should follow this shape:

```text
receive intent
  -> parse and bound input
  -> resolve authenticated session
  -> authorize capability
  -> load authoritative state
  -> validate domain invariants
  -> apply idempotency/concurrency control
  -> commit transaction
  -> append audit/domain event
  -> project result
```

Never reverse this by trusting the client result and “syncing” it into persistence.

## Economy requirements

- monetary values use integer minor units;
- a transaction cannot commit without non-empty balanced entries and an immutable finalization record;
- database triggers serialize finalization against entry insertion and reject later appends;
- ledger entries are immutable once committed;
- corrections are compensating transactions;
- balances are derived/updated under transactional invariants;
- reward grants have a unique source/reference when retry is possible;
- staff economy actions include actor, reason and correlation identifier.

## Inventory and ownership requirements

- quantities cannot be negative;
- transfer source ownership is validated server-side;
- a unique serialized asset cannot have two canonical owners;
- container capacity/weight rules are enforced in the same use case as mutation;
- destroy/recover/impound/evidence flows are explicit state transitions when relevant.

## Administrative security

Staff tools must not become a universal bypass layer.

- permissions are capability-based where practical;
- in-character police/faction authority is not equivalent to out-of-character staff authority;
- grants, corrections, bans and destructive operations require a reason;
- sensitive actions emit durable audit records;
- emergency/manual database access is not a normal moderation workflow.

The F1 grant path persists the server-resolved actor, reason, correlation ID and finalized ledger
transaction in one PostgreSQL transaction. The audit row is append-only; a failed audit insert rolls
back the money movement. API retries with the same idempotency key return the committed receipt and
do not add a second audit row. A deferred database constraint also rejects any treasury posting that
tries to commit without its matching privileged-action audit, including writes that bypass the
application repository.

## Availability and abuse controls

Security includes protecting the service from intentionally expensive usage.

- bound payload sizes and collection counts;
- paginate administrative searches;
- use timeouts around external/runtime calls;
- rate-limit abuse-prone commands per account/session and, where useful, connection/IP;
- reject impossible requests before opening expensive transactions;
- treat repeated authorization/invariant failures as security telemetry.

The current local API has in-process limits (bootstrap per IP, authenticated requests per IP/session,
and staff grants per operator account). They reset on process restart and do not coordinate multiple
instances. A shared limiter and explicitly trusted proxy boundary are required before horizontal or
public deployment. The API does not trust `X-Forwarded-For`.

## Supply-chain controls

- pin GitHub Actions to reviewed commit SHAs;
- pin container images to reviewed digests and refresh them deliberately from the official image source;
- commit and review the package lockfile before frozen installs become mandatory;
- review dependency major upgrades together when compatibility is coupled;
- review packages that request lifecycle/build scripts;
- keep CI permissions read-only unless a workflow requires a narrowly scoped write;
- do not place production secrets in pull-request workflows.

## Data handling

Collect only data the server actually needs.

- avoid secrets and raw credentials in logs;
- separate production data from development fixtures;
- define retention for moderation/justice records before production;
- protect backup access as strongly as the live database;
- redact or minimize sensitive values in operational telemetry.

## Future GTA VI runtime boundary

Before a real GTA VI adapter exists, the following remain `UNKNOWN`:

- platform anti-cheat capabilities;
- runtime event security properties;
- entity ownership guarantees;
- player identifier guarantees;
- transport encryption/authentication behavior;
- server binary/plugin isolation;
- runtime permission hooks.

These unknowns must not weaken the server-authoritative model. Runtime protections may add defense in depth later; they do not replace domain validation.

## Security acceptance for new features

A feature that changes valuable or privileged state should not merge until its PR explains:

- trusted and untrusted inputs;
- authoritative source of truth;
- authorization rule;
- replay/idempotency behavior;
- concurrency/transaction behavior;
- audit requirements;
- abuse/rate-limit considerations;
- runtime-specific assumptions, if any.

See also `SECURITY.md`, `docs/architecture/BOUNDARIES.md`,
`docs/operations/OPERATIONS_BASELINE.md`, the [F1 API guide](../operations/API_F1_LOCAL.es.md)
and its [English summary](../../apps/api/README.md).
