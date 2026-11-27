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

import { MutableClock, openDatabase } from './helpers/database.js';

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
      const characterStore = new InMemoryCharacterStore({
        knownAccounts: [accountOne, accountTwo],
      });
      const accountStore = new InMemoryFinancialAccountStore();
      const ledgerStore = new InMemoryLedgerStore();
      return {
        characters: new CharacterService(characterStore, { clock: new MutableClock(START) }),
        ledger: new LedgerService(accountStore, ledgerStore, directoryFor(characterStore)),
        accountStore,
        ledgerStore,
        dispose: async () => undefined,
      };
    },
  ],
  [
    'PostgreSQL repositories (embedded engine)',
    async () => {
      const database = await openDatabase();
      const accounts = new PgAccountRepository(database.sql);
      await accounts.ensureAccount(accountOne);
      await accounts.ensureAccount(accountTwo);
      const characterStore = new PgCharacterRepository(database.sql);
      const accountStore = new PgFinancialAccountRepository(database.sql);
      const ledgerStore = new PgLedgerRepository(database.sql);
      return {
        characters: new CharacterService(characterStore, { clock: new MutableClock(START) }),
        ledger: new LedgerService(accountStore, ledgerStore, directoryFor(characterStore)),
        accountStore,
        ledgerStore,
        dispose: database.dispose,
      };
    },
  ],
];

async function seededCharacters(world: MoneyWorld) {
  const alex = await world.characters.create(playerOne, {
    firstName: 'Alex',
    lastName: 'Rivera',
  });
  const morgan = await world.characters.create(playerTwo, {
    firstName: 'Morgan',
    lastName: 'Cruz',
  });
  return { alex, morgan };
}

for (const [label, createWorld] of worldFactories) {
  describe(`ledger under concurrency — ${label}`, () => {
    it('deduplicates a burst of identical concurrent commands to exactly one posting', async () => {
      const world = await createWorld();
      const { alex } = await seededCharacters(world);

      const burst = await Promise.all(
        Array.from({ length: 24 }, () =>
          world.ledger
            .grant(admin, {
              requestId: 'race-grant',
              toCharacterId: alex.id,
              amountMinor: 1_000n,
              reason: 'Test fixture grant',
              correlationId: 'test-grant',
            })
            .then(
              (receipt) => ({ ok: true as const, receipt }),
              (error: unknown) => ({ ok: false as const, error }),
            ),
        ),
      );

      // Every caller that succeeds must see the same transaction.
      const winners = burst.filter((result) => result.ok);
      const transactionIds = new Set(winners.map((result) => result.receipt.transactionId));
      expect(transactionIds.size).toBe(1);
      expect(burst.filter((result) => !result.ok)).toEqual([]);

      // Exactly one posting: the credit applied once and the treasury
      // debited once.
      expect(await world.ledger.getCharacterBalance(alex.id)).toBe(1_000n);
      const treasury = await world.accountStore.treasuryAccount();
      expect(await world.ledgerStore.getBalance(treasury.id)).toBe(-1_000n);
      await world.dispose();
    });

    it('applies each distinct concurrent command exactly once, with no duplicated value', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seededCharacters(world);
      await world.ledger.grant(admin, {
        requestId: 'seed-race',
        toCharacterId: alex.id,
        amountMinor: 10_000n,
        reason: 'Test fixture grant',
        correlationId: 'test-grant',
      });

      // 12 distinct transfers of 250 each race while all are affordable
      // (12 x 250 = 3,000 of 10,000): the race can only be won by all of
      // them, each exactly once.
      const results = await Promise.all(
        Array.from({ length: 12 }, (_, index) =>
          world.ledger
            .transfer(playerOne, {
              requestId: `race-${index}`,
              fromCharacterId: alex.id,
              toCharacterId: morgan.id,
              amountMinor: 250n,
            })
            .then(
              (receipt) => ({ ok: true as const, receipt }),
              (error: unknown) => ({ ok: false as const, error }),
            ),
        ),
      );

      const posted = results.filter((result) => result.ok);
      expect(posted.length).toBe(12);

      // Invariants however the race interleaved: no negative balance, money
      // conservation, and no duplicated postings (distinct transaction ids).
      const alexBalance = await world.ledger.getCharacterBalance(alex.id);
      const morganBalance = await world.ledger.getCharacterBalance(morgan.id);
      expect(alexBalance).toBe(7_000n);
      expect(morganBalance).toBe(3_000n);
      expect(alexBalance + morganBalance).toBe(10_000n);
      const postedIds = new Set(posted.map((result) => result.receipt.transactionId));
      expect(postedIds.size).toBe(12);
      await world.dispose();
    });

    it('rejects concurrent same-key different-amount commands without partial writes', async () => {
      const world = await createWorld();
      const { alex } = await seededCharacters(world);

      const outcomes = await Promise.allSettled([
        world.ledger.grant(admin, {
          requestId: 'conflicting',
          toCharacterId: alex.id,
          amountMinor: 500n,
          reason: 'Test fixture grant',
          correlationId: 'test-grant',
        }),
        world.ledger.grant(admin, {
          requestId: 'conflicting',
          toCharacterId: alex.id,
          amountMinor: 700n,
          reason: 'Test fixture grant',
          correlationId: 'test-grant',
        }),
      ]);

      // Exactly one amount won; the loser is an idempotency conflict, and
      // the final balance equals one of the two amounts, never their sum.
      const balance = await world.ledger.getCharacterBalance(alex.id);
      expect([500n, 700n]).toContain(balance);
      const rejections = outcomes
        .filter((outcome) => outcome.status === 'rejected')
        .map((outcome) => (outcome as PromiseRejectedResult).reason);
      expect(rejections.length).toBe(1);
      expect(rejections[0]).toBeInstanceOf(DomainError);
      expect((rejections[0] as DomainError).code).toBe('IDEMPOTENCY_CONFLICT');
      await world.dispose();
    });

    it('enforces the balance ceiling for simultaneous incoming credits', async () => {
      const world = await createWorld();
      const { alex } = await seededCharacters(world);
      const treasury = await world.accountStore.treasuryAccount();
      const destination = await world.accountStore.ensureAccount(alex.id, 'cash');
      const ceiling = 10_000_000_000_000n;
      await world.ledgerStore.post({
        idempotencyKey: 'ceiling:seed',
        fingerprint: 'ceiling:seed',
        reference: null,
        legs: [
          { financialAccountId: treasury.id, amountMinor: -(ceiling - 100n) },
          { financialAccountId: destination.id, amountMinor: ceiling - 100n },
        ],
        privilegedAudit: {
          action: 'economy.grant',
          actorAccountId: admin.accountId,
          reason: 'Seed the balance ceiling concurrency test',
          correlationId: 'ceiling:seed',
        },
      });

      const outcomes = await Promise.allSettled(
        Array.from({ length: 2 }, (_, index) =>
          world.ledgerStore.post({
            idempotencyKey: `ceiling:${index}`,
            fingerprint: `ceiling:${index}`,
            reference: null,
            legs: [
              { financialAccountId: treasury.id, amountMinor: -75n },
              { financialAccountId: destination.id, amountMinor: 75n },
            ],
            privilegedAudit: {
              action: 'economy.grant',
              actorAccountId: admin.accountId,
              reason: 'Test simultaneous incoming credits at the balance ceiling',
              correlationId: `ceiling:${index}`,
            },
          }),
        ),
      );

      expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1);
      for (const outcome of outcomes) {
        if (outcome.status === 'rejected') {
          expect(outcome.reason).toBeInstanceOf(DomainError);
          expect((outcome.reason as DomainError).code).toBe('BALANCE_LIMIT');
        }
      }
      expect(await world.ledgerStore.getBalance(destination.id)).toBe(ceiling - 25n);
      await world.dispose();
    });

    it('keeps the never-negative invariant under a concurrent overdraft race', async () => {
      const world = await createWorld();
      const { alex, morgan } = await seededCharacters(world);
      await world.ledger.grant(admin, {
        requestId: 'funds',
        toCharacterId: alex.id,
        amountMinor: 1_000n,
        reason: 'Test fixture grant',
        correlationId: 'test-grant',
      });

      // Five transfers of 400 race for 1,000: at most two can ever win.
      const outcomes = await Promise.allSettled(
        Array.from({ length: 5 }, (_, index) =>
          world.ledger.transfer(playerOne, {
            requestId: `overdraft-race-${index}`,
            fromCharacterId: alex.id,
            toCharacterId: morgan.id,
            amountMinor: 400n,
          }),
        ),
      );

      const winners = outcomes.filter((outcome) => outcome.status === 'fulfilled');
      expect(winners.length).toBeLessThanOrEqual(2);
      const alexBalance = await world.ledger.getCharacterBalance(alex.id);
      const morganBalance = await world.ledger.getCharacterBalance(morgan.id);
      expect(alexBalance).toBeGreaterThanOrEqual(0n);
      expect(alexBalance + morganBalance).toBe(1_000n);
      expect(morganBalance).toBe(BigInt(winners.length) * 400n);
      for (const outcome of outcomes) {
        if (outcome.status === 'rejected') {
          expect(outcome.reason).toBeInstanceOf(DomainError);
          expect((outcome.reason as DomainError).code).toBe('INSUFFICIENT_FUNDS');
        }
      }
      await world.dispose();
    });
  });
}
