import { describe, expect, it } from 'vitest';

import { newUuid } from '@gta6-rp/core';
import {
  CharacterService,
  DomainError,
  InMemoryCharacterStore,
  InMemoryFinancialAccountStore,
  InMemoryLedgerStore,
  LedgerService,
} from '@gta6-rp/core';
import type {
  CharacterOwnershipDirectory,
  CharacterStore,
  FinancialAccountStore,
  LedgerStore,
  SessionPrincipal,
  Uuid,
} from '@gta6-rp/core';
import {
  PgAccountRepository,
  PgCharacterRepository,
  PgFinancialAccountRepository,
  PgLedgerRepository,
} from '@gta6-rp/persistence';

import { MutableClock, openDatabase, reopenDatabase } from './helpers/database.js';

const accountOne = newUuid();
const accountTwo = newUuid();
const START = new Date('2026-11-25T12:00:00.000Z');

const admin: SessionPrincipal = { accountId: accountOne, capabilities: ['economy.grant'] };
const playerOne: SessionPrincipal = { accountId: accountOne, capabilities: [] };
const playerTwo: SessionPrincipal = { accountId: accountTwo, capabilities: [] };

interface MoneyWorld {
  readonly characters: CharacterService;
  readonly ledger: LedgerService;
  readonly accountStore: FinancialAccountStore;
  readonly ledgerStore: LedgerStore;
  readonly clock: MutableClock;
  dispose(): Promise<void>;
}

function directoryFor(store: CharacterStore): CharacterOwnershipDirectory {
  return {
    findOwnerAccount: async (characterId: Uuid) =>
      (await store.findById(characterId))?.accountId ?? null,
  };
}

const worldFactories: readonly [label: string, factory: () => Promise<MoneyWorld>][] = [
  [
    'in-memory stores',
    async () => {
      const clock = new MutableClock(START);
      const characterStore = new InMemoryCharacterStore({
        knownAccounts: [accountOne, accountTwo],
      });
      const accountStore = new InMemoryFinancialAccountStore();
      const ledgerStore = new InMemoryLedgerStore();
      return {
        characters: new CharacterService(characterStore, { clock }),
        ledger: new LedgerService(accountStore, ledgerStore, directoryFor(characterStore)),
        accountStore,
        ledgerStore,
        clock,
        dispose: async () => undefined,
      };
    },
  ],
  [
    'PostgreSQL repositories (embedded engine)',
    async () => {
      const clock = new MutableClock(START);
      const database = await openDatabase();
      const accounts = new PgAccountRepository(database.sql);
      await accounts.ensureAccount(accountOne);
      await accounts.ensureAccount(accountTwo);
      const characterStore = new PgCharacterRepository(database.sql);
      const accountStore = new PgFinancialAccountRepository(database.sql);
      const ledgerStore = new PgLedgerRepository(database.sql);
      return {
        characters: new CharacterService(characterStore, { clock }),
        ledger: new LedgerService(accountStore, ledgerStore, directoryFor(characterStore)),
        accountStore,
        ledgerStore,
        clock,
        dispose: database.dispose,
      };
    },
  ],
];

async function failsWith(code: string, work: () => unknown | Promise<unknown>): Promise<void> {
  try {
    await work();
    throw new Error('Expected a domain error');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe(code);
  }
}

async function seeded(world: MoneyWorld) {
  const alex = await world.characters.create(playerOne, { firstName: 'Alex', lastName: 'Rivera' });
  const morgan = await world.characters.create(playerTwo, {
    firstName: 'Morgan',
    lastName: 'Cruz',
  });
  return { alex, morgan };
}

for (const [label, createWorld] of worldFactories) {
  describe(`double-entry ledger — ${label}`, () => {
    it('starts every character at a zero balance with a lazily provisioned cash account', async () => {
      const world = await createWorld();
      const { alex } = await seeded(world);

      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(0n);
      await world.dispose();
    });

    it('grants from the treasury and keeps the books balanced', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seeded(world);

      const grant = await world.ledger.grant(admin, {
        requestId: 'pay-001',
        toCharacterId: alex.id,
        amountMinor: 250_000n,
      });
      expect(grant.posted).toBe(true);

      const treasury = await world.accountStore.treasuryAccount();
      expect(await world.ledgerStore.getBalance(treasury.id)).toBe(-250_000n);
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(250_000n);
      expect(await world.ledger.getCharacterBalance(morgan.id)).toBe(0n);

      // Conservation: treasury debit equals the credited destination exactly.
      const treasuryEntries = await world.ledgerStore.listAccountEntries(treasury.id, 10);
      expect(treasuryEntries[0]?.amountMinor).toBe(-250_000n);
      await world.dispose();
    });

    it('transfers between characters with ownership, funds and self-transfer rules', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seeded(world);
      await world.ledger.grant(admin, {
        requestId: 'seed',
        toCharacterId: alex.id,
        amountMinor: 500n,
      });

      const receipt = await world.ledger.transfer(playerOne, {
        requestId: 'pay-002',
        fromCharacterId: alex.id,
        toCharacterId: morgan.id,
        amountMinor: 125n,
      });
      expect(receipt.posted).toBe(true);
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(375n);
      expect(await world.ledger.getCharacterBalance(morgan.id)).toBe(125n);

      await failsWith('FORBIDDEN', () =>
        world.ledger.transfer(playerTwo, {
          requestId: 'steal',
          fromCharacterId: alex.id,
          toCharacterId: morgan.id,
          amountMinor: 1n,
        }),
      );
      await failsWith('SELF_TRANSFER', () =>
        world.ledger.transfer(playerOne, {
          requestId: 'self',
          fromCharacterId: alex.id,
          toCharacterId: alex.id,
          amountMinor: 1n,
        }),
      );
      await failsWith('INSUFFICIENT_FUNDS', () =>
        world.ledger.transfer(playerOne, {
          requestId: 'overdraft',
          fromCharacterId: alex.id,
          toCharacterId: morgan.id,
          amountMinor: 376n,
        }),
      );
      await failsWith('FORBIDDEN', () =>
        world.ledger.grant(playerOne, {
          requestId: 'mint-attempt',
          toCharacterId: alex.id,
          amountMinor: 1n,
        }),
      );
      await world.dispose();
    });

    it('is idempotent: the same request replays the original receipt without double-credit', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seeded(world);
      const command = {
        requestId: 'repeatable',
        fromCharacterId: alex.id,
        toCharacterId: morgan.id,
        amountMinor: 100n,
      } as const;
      await world.ledger.grant(admin, {
        requestId: 'seed',
        toCharacterId: alex.id,
        amountMinor: 500n,
      });

      const first = await world.ledger.transfer(playerOne, command);
      const replay = await world.ledger.transfer(playerOne, command);

      expect(replay.transactionId).toBe(first.transactionId);
      expect(replay.posted).toBe(false);
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(400n);
      expect(await world.ledger.getCharacterBalance(morgan.id)).toBe(100n);

      const grant = await world.ledger.grant(admin, {
        requestId: 'seed',
        toCharacterId: alex.id,
        amountMinor: 500n,
      });
      expect(grant.posted).toBe(false);
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(400n);
      await world.dispose();
    });

    it('rejects a reused idempotency key carrying different arguments', async () => {
      const world = await createWorld();
      const { alex } = await seeded(world);
      await world.ledger.grant(admin, {
        requestId: 'reused',
        toCharacterId: alex.id,
        amountMinor: 100n,
      });

      await failsWith('IDEMPOTENCY_CONFLICT', () =>
        world.ledger.grant(admin, {
          requestId: 'reused',
          toCharacterId: alex.id,
          amountMinor: 200n,
        }),
      );
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(100n);
      await world.dispose();
    });

    it('bounds amounts, identifiers and balances', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seeded(world);

      await failsWith('INVALID_AMOUNT', () =>
        world.ledger.grant(admin, { requestId: 'a1', toCharacterId: alex.id, amountMinor: 0n }),
      );
      await failsWith('INVALID_AMOUNT', () =>
        world.ledger.grant(admin, {
          requestId: 'a2',
          toCharacterId: alex.id,
          amountMinor: 1_000_000_000_001n,
        }),
      );
      await failsWith('INVALID_IDENTIFIER', () =>
        world.ledger.grant(admin, {
          requestId: 'bad key with spaces!',
          toCharacterId: alex.id,
          amountMinor: 1n,
        }),
      );
      await failsWith('INVALID_IDENTIFIER', () =>
        world.ledger.grant(admin, {
          requestId: 'a3',
          toCharacterId: 'not-a-uuid' as Uuid,
          amountMinor: 1n,
        }),
      );
      await failsWith('CHARACTER_NOT_FOUND', () =>
        world.ledger.grant(admin, {
          requestId: 'a4',
          toCharacterId: newUuid(),
          amountMinor: 1n,
        }),
      );

      // Fill the account to the balance ceiling with valid maximum grants.
      for (let index = 0; index < 10; index += 1) {
        await world.ledger.grant(admin, {
          requestId: `fill-${index}`,
          toCharacterId: alex.id,
          amountMinor: 1_000_000_000_000n,
        });
      }
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(10_000_000_000_000n);
      await failsWith('BALANCE_LIMIT', () =>
        world.ledger.grant(admin, {
          requestId: 'over-limit',
          toCharacterId: alex.id,
          amountMinor: 1n,
        }),
      );
      // Morgan is unaffected by the failed attempts.
      expect(await world.ledger.getCharacterBalance(morgan.id)).toBe(0n);
      await world.dispose();
    });

    it('produces a readable statement of signed entries', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seeded(world);
      await world.ledger.grant(admin, {
        requestId: 'g1',
        toCharacterId: alex.id,
        amountMinor: 500n,
      });
      await world.ledger.transfer(playerOne, {
        requestId: 't1',
        fromCharacterId: alex.id,
        toCharacterId: morgan.id,
        amountMinor: 200n,
      });

      const statement = await world.ledger.getCharacterStatement(alex.id, 10);
      expect(statement.length).toBe(2);
      expect(statement[0]?.amountMinor).toBe(-200n); // newest first
      expect(statement[1]?.amountMinor).toBe(500n);
      expect(statement[0]?.idempotencyKey).toBe('t1');
      await world.dispose();
    });

    it('refuses unbalanced and malformed transactions at the store level', async () => {
      const world = await createWorld();
      const { alex } = await seeded(world);
      const cash = await world.accountStore.ensureAccount(alex.id, 'cash');

      const treasury = await world.accountStore.treasuryAccount();
      await failsWith('UNBALANCED_TRANSACTION', () =>
        world.ledgerStore.post({
          idempotencyKey: 'u1',
          fingerprint: 'unbalanced',
          reference: null,
          legs: [
            { financialAccountId: cash.id, amountMinor: 5n },
            { financialAccountId: treasury.id, amountMinor: 4n },
          ],
        }),
      );
      await failsWith('UNBALANCED_TRANSACTION', () =>
        world.ledgerStore.post({
          idempotencyKey: 'u2',
          fingerprint: 'zero-leg',
          reference: null,
          legs: [
            { financialAccountId: cash.id, amountMinor: 5n },
            { financialAccountId: cash.id, amountMinor: -5n },
          ],
        }),
      );
      // Nothing was written by either failed command.
      expect(await world.ledgerStore.getBalance(cash.id)).toBe(0n);
      await world.dispose();
    });
  });
}

describe('double-entry ledger — restart survival (PostgreSQL)', () => {
  it('keeps every balance, transaction and statement intact across a full restart', async () => {
    const first = await openDatabase();
    const accounts = new PgAccountRepository(first.sql);
    await accounts.ensureAccount(accountOne);
    await accounts.ensureAccount(accountTwo);
    const characterStore = new PgCharacterRepository(first.sql);
    const accountStore = new PgFinancialAccountRepository(first.sql);
    const ledgerStore = new PgLedgerRepository(first.sql);
    const clock = new MutableClock(START);
    const characters = new CharacterService(characterStore, { clock });
    const ledger = new LedgerService(accountStore, ledgerStore, directoryFor(characterStore));

    const alex = await characters.create(playerOne, { firstName: 'Alex', lastName: 'Rivera' });
    const morgan = await characters.create(playerTwo, { firstName: 'Morgan', lastName: 'Cruz' });
    await ledger.grant(admin, { requestId: 'run1-grant', toCharacterId: alex.id, amountMinor: 900n });
    await ledger.transfer(playerOne, {
      requestId: 'run1-transfer',
      fromCharacterId: alex.id,
      toCharacterId: morgan.id,
      amountMinor: 350n,
    });
    const beforeBalances = [await ledger.getCharacterBalance(alex.id), await ledger.getCharacterBalance(morgan.id)];
    await first.close();

    const reopened = await reopenDatabase(first.directory);
    const accountStore2 = new PgFinancialAccountRepository(reopened.sql);
    const ledgerStore2 = new PgLedgerRepository(reopened.sql);
    const ledger2 = new LedgerService(
      accountStore2,
      ledgerStore2,
      directoryFor(new PgCharacterRepository(reopened.sql)),
    );

    expect(await ledger2.getCharacterBalance(alex.id)).toBe(beforeBalances[0]);
    expect(await ledger2.getCharacterBalance(morgan.id)).toBe(beforeBalances[1]);
    const treasury = await accountStore2.treasuryAccount();
    expect(await ledgerStore2.getBalance(treasury.id)).toBe(-900n);

    // Replaying the run-1 commands after the restart deduplicates, never double-credits.
    const replayedGrant = await ledger2.grant(admin, {
      requestId: 'run1-grant',
      toCharacterId: alex.id,
      amountMinor: 900n,
    });
    expect(replayedGrant.posted).toBe(false);
    expect(await ledger2.getCharacterBalance(alex.id)).toBe(beforeBalances[0]);

    // A new command after the restart continues the ledger where it left off.
    await ledger2.grant(admin, { requestId: 'run2-grant', toCharacterId: morgan.id, amountMinor: 50n });
    expect(await ledger2.getCharacterBalance(morgan.id)).toBe(beforeBalances[1]! + 50n);
    await reopened.dispose();
  });
});
