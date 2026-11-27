# CALM Essentials service contracts — original proposal

**Status:** PROPOSAL (design direction for roadmap Phases F1–F4; nothing here is implemented yet)
**Date:** 2026-11-27 · **Product scope:** [ADR-0009](../adr/0009-gta-vi-first-product-scope.md)

## Origin and boundary

The operation names and service boundaries below are derived from CALM's own roleplay requirements: trusted character sessions, persistent economy, inventory ownership, employment and permissions. They are original CALM proposals; they are not GTA VI APIs, compatibility shims, or translations of another framework's interfaces.

## Draft application contract (TypeScript)

```ts
export type CharacterId = string & {
  readonly __brand: 'CharacterId';
};

export type FinancialAccountId = string & {
  readonly __brand: 'FinancialAccountId';
};

export interface TrustedContext {
  readonly accountId: string;
  readonly characterId: CharacterId;
  readonly permissions: ReadonlySet<string>;
}

export interface TransferMoneyCommand {
  readonly requestId: string;
  readonly from: FinancialAccountId;
  readonly to: FinancialAccountId;
  readonly amountMinor: bigint;
}

export interface TransferReceipt {
  readonly transactionId: string;
  readonly requestId: string;
}

export interface EconomyService {
  getBalance(context: TrustedContext, accountId: FinancialAccountId): Promise<bigint>;
  transfer(context: TrustedContext, command: TransferMoneyCommand): Promise<TransferReceipt>;
}

export interface JobsService {
  assign(context: TrustedContext, target: CharacterId, jobId: string, grade: number): Promise<void>;
  setDuty(context: TrustedContext, onDuty: boolean): Promise<void>;
}
```

This is an **application contract, not a finished implementation**.

### Security requirements before any real implementation

- Identity comes from an **authenticated session**; `accountId`/`characterId` are never trusted just because a client includes them in a request.
- Financial operations check **ownership, permissions, balance, idempotency and transactional isolation** before producing changes.
- Money stays in integer minor units; every movement is auditable and restart-safe.
- These are CALM security requirements derived from its server-authority and persistence goals.

## Feature modules and manifest — proposal

A CALM feature module represents one cohesive roleplay domain. The project owner's `smj_` namespace is used for authored module IDs (for example, `smj_character` and `smj_money`); it does not imply a game-recognized resource name. See [ADR-0010](../adr/0010-user-owned-feature-modules.md) for the framework/module split.

When the project has proved its contracts with independent modules, each module may declare dependencies and permissions through a CALM manifest. **This illustrative format is a CALM proposal**, not a format recognized by GTA VI:

```json
{
  "id": "smj_jobs",
  "version": "0.1.0",
  "description": "Roleplay employment services",
  "dependencies": {
    "calm:character-contract": "^0.1.0",
    "smj_money": "^0.1.0"
  },
  "permissions": ["jobs.read", "jobs.assign", "jobs.manage"],
  "verificationTarget": "simulator"
}
```

The `calm:character-contract` entry and all field names above are examples, not implemented package IDs or a final schema. Sequencing rule: **first prove** that two independent CALM modules communicate through public services, resolve dependencies correctly and keep their data; **then formalize** the extension system. Until then, modules are CALM-owned domain/package boundaries within the current modular monolith; no dynamic game-resource loading or third-party ABI is promised. Each module keeps control of its own tables and accesses others through defined interfaces, never by querying their internal data.

## Implementation gate

Implement each contract from CALM's product requirements and validate it against the deterministic simulator. Keep game-facing behavior behind the blocked adapter boundary until a public, authorized GTA VI contract exists. Do not add guessed native names, offsets, asset formats or interfaces to these service contracts.
