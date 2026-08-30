# Operations Baseline

**State:** ACTIVE

This document defines the operational capabilities expected before the future RP server is treated as production-ready.

It deliberately avoids GTA VI hosting assumptions that are not publicly known.

## Operating principle

The server must be recoverable, observable and auditable without relying on staff memory or direct database manipulation.

Production readiness is not equivalent to “the game server starts”.

## Environments

Plan for at least three logical environments:

| Environment | Purpose | Persistent data policy |
| --- | --- | --- |
| Local | Development and deterministic simulation | Disposable |
| Staging | Integration, migration and release verification | Non-production, resettable |
| Production | Live community | Durable and protected |

Production credentials, identifiers and player data must never be reused in local development fixtures.

## Configuration

Configuration should be explicit and environment-driven.

- secrets remain outside source control;
- defaults must be safe for local development, not silently production-like;
- missing required production configuration should fail startup;
- configuration affecting gameplay/economy should be versioned or auditable;
- runtime-specific configuration belongs behind the relevant adapter boundary.

## Database operations

PostgreSQL is the planned durable source of truth.

Before production:

- migrations are forward-only and reviewed;
- schema changes are exercised against a production-like dataset;
- backup and restore procedures are tested, not merely configured;
- point-in-time recovery requirements are defined;
- destructive maintenance requires an explicit runbook;
- staff tools do not bypass domain invariants through ad-hoc SQL.

## Backup objectives

Exact targets remain environment-dependent, but production must define:

- recovery point objective (RPO);
- recovery time objective (RTO);
- backup frequency;
- retention policy;
- encrypted storage location;
- restoration verification cadence;
- responsibility for declaring a restore complete.

A backup that has never been restored in a test is not considered verified.

## Observability

Minimum production telemetry:

### Logs

- structured server/application logs;
- request/command correlation identifiers;
- authentication/authorization failures;
- domain invariant failures;
- staff/admin actions;
- migration/startup failures;
- adapter/runtime integration errors.

Avoid logging secrets, raw authentication credentials or unnecessary personal data.

### Metrics

Plan for:

- connected sessions;
- command/request rates;
- error rates;
- latency of critical transactions;
- database pool health;
- queue/backlog metrics if queues are ever introduced;
- economy mutation counts and abnormal failure rates;
- adapter/runtime disconnect/retry indicators.

### Health checks

Health endpoints/checks should distinguish:

- process alive;
- application ready;
- durable dependencies reachable;
- runtime adapter connected/usable when required.

A degraded optional cache must not be reported as loss of canonical state.

## Incident handling

Production incidents require a lightweight but explicit sequence:

1. detect and classify impact;
2. stop ongoing state corruption when necessary;
3. preserve logs/audit evidence;
4. restore service safely;
5. reconcile durable state through domain-supported corrections;
6. document root cause and prevention work.

Economy or ownership corrections should use auditable compensating operations rather than hidden row edits.

## Access control

- production infrastructure access follows least privilege;
- staff game permissions are separate from infrastructure/database privileges;
- emergency access is exceptional and logged;
- service credentials are scoped per component where practical;
- access should be removable without rebuilding the environment.

## Release discipline

A production release should have:

- a reviewed change set;
- green CI;
- migration impact understood;
- rollback/forward-fix strategy;
- configuration changes identified;
- runtime compatibility verified when a GTA VI adapter eventually exists;
- a short release note for material player/staff-facing behavior changes.

## Runtime hosting unknowns

These remain blocked until a legitimate GTA VI community-server path exists:

- supported server operating systems;
- server binary/runtime distribution;
- CPU/memory/network profile;
- process lifecycle and orchestration model;
- player/session limits;
- official or authorized hosting restrictions;
- runtime update cadence;
- game asset/resource deployment model.

Do not select permanent production hosting architecture around guessed values for these requirements.

## Production readiness gate

The server is not production-ready until all of the following are demonstrated:

- durable state survives process/runtime restarts;
- migrations are repeatable and reviewed;
- backup restoration has been tested;
- privileged actions are auditable;
- important failures are observable;
- security-sensitive configuration is externalized;
- incident recovery has a documented path;
- runtime-specific deployment requirements are based on verified documentation;
- a clean release can be deployed without manual database surgery.
