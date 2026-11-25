# CALM Essentials service contracts — proposal

**Status:** PROPOSAL (design direction for roadmap Phases F1–F4; nothing here is implemented yet)
**Date:** 2026-11-25 · **Scope decision:** [ADR-0007](../adr/0007-calm-essentials-framework-scope.md)
**References:** documented public interfaces of ESX Legacy, QBCore and Qbox (studied as concepts only — their cores are GPL, this project is MIT)

## Naming and provenance

The CALM operation names below are **original proposals**. They are not implemented functions, not copies of GTA VI signatures, and not compatibility shims. The correspondence table starts from the **verified public documentation** of the reference frameworks; the architecture comparison records the pattern verdicts.

## Correspondence with documented reference interfaces

| Concept                 | Documented reference API                                                            | Proposed CALM API         |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------- |
| Player                  | `ESX.GetPlayerFromId` / `QBCore.Functions.GetPlayer` / `exports.qbx_core:GetPlayer` | `sessions.getCharacter()` |
| Character data          | `xPlayer` / `PlayerData`                                                            | `characters.get()`        |
| Read balance            | `getAccount` / `GetMoney` / `exports.qbx_core:GetMoney`                             | `economy.getBalance()`    |
| Credit money            | `xPlayer.addAccountMoney` / `AddMoney`                                              | `economy.credit()`        |
| Debit money             | `xPlayer.removeAccountMoney` / `RemoveMoney`                                        | `economy.debit()`         |
| Transfer money          | framework financial operations                                                      | `economy.transfer()`      |
| Read inventory item     | `getInventoryItem`                                                                  | `inventory.getItem()`     |
| Add item                | `addInventoryItem`                                                                  | `inventory.add()`         |
| Move item               | inventory operations                                                                | `inventory.transfer()`    |
| Assign job              | `xPlayer.setJob` / `exports.qbx_core:SetJob`                                        | `jobs.assign()`           |
| Duty state              | `exports.qbx_core:SetJobDuty`                                                       | `jobs.setDuty()`          |
| Permission check        | `QBCore.Functions.HasPermission`                                                    | `permissions.check()`     |
| Register extension hook | `registerHook`-class patterns                                                       | `hooks.register()`        |

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
- These requirements follow the documented security practices of the Cfx ecosystem and the Qbox development criteria.

## Module manifest — proposal

A module declares its own dependencies and permissions via a CALM manifest. **This format is a CALM proposal**, not a format recognized by GTA VI:

```json
{
  "name": "calm-jobs",
  "version": "0.1.0",
  "description": "Roleplay employment services",
  "dependencies": {
    "calm-core": "^0.1.0",
    "calm-economy": "^0.1.0"
  },
  "permissions": ["jobs.read", "jobs.assign", "jobs.manage"],
  "target": "simulator"
}
```

Sequencing rule: **first prove** that two independent modules communicate through public services, resolve dependencies correctly and keep their data; **then formalize** the extension system. Each module keeps control of its own tables and accesses the others through defined interfaces, never by querying their internal data (the discipline the Qbox documentation recommends for its resources).

## Licensing note

ESX Legacy's core and `qbx_core` are GPL-licensed; this repository is MIT. Concepts and patterns are studied from their public documentation; implementations are original. Any specific reuse of a fragment would require a documented license-compatibility review before inclusion — none is planned or present.
