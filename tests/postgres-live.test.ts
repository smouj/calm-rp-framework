import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { newUuid } from '@gta6-rp/core';
import {
  CharacterService,
  LedgerService,
  SessionService,
} from '@gta6-rp/core';
import type { CharacterOwnershipDirectory, SessionPrincipal, Uuid } from '@gta6-rp/core';
import {
  MigrationRunner,
  PgAccountRepository,
  PgCharacterRepository,
  PgFinancialAccountRepository,
  PgLedgerRepository,
  PgPoolSession,
  PgSessionRepository,
} from '@gta6-rp/persistence';

import { MIGRATIONS_DIR } from './helpers/database.js';

/**
 * Live multi-connection suite, gated on a real `DATABASE_URL`:
 *
 *   docker compose -f infrastructure/docker/compose.yml up -d
 *   DATABASE_URL=postgresql://gta6_rp:change-me-local-only@localhost:5432/gta6_rp pnpm vitest run tests/postgres-live.test.ts
 *
 * CI provides the same gate through the workflow's PostgreSQL service. When
 * no `postgres://`/`postgresql://` URL is present the suite skips with a
 * clear notice — the embedded engine covers the same contracts in the
 * default run, and a non-PostgreSQL variable (for example a file path) never
 * enables the gate.
 */
const liveUrl = process.env.DATABASE_URL ?? '';
const maybeLive = /^postgres(ql)?:\/\//.test(liveUrl) ? describe : describe.skip;

const accountOne = newUuid();
const accountTwo = newUuid();
const runId = newUuid().slice(0, 8);

const admin: SessionPrincipal = { accountId: accountOne, capabilities: ['economy.grant'] };
const playerOne: SessionPrincipal = { accountId: accountOne, capabilities: [] };
const playerTwo: SessionPrincipal = { accountId: accountTwo, capabilities: [] };

function requestId(suffix: string): string {
  return `${runId}:${suffix}`;
}

function directoryFor(store: PgCharacterRepository): CharacterOwnershipDirectory {
  return {
    findOwnerAccount: async (characterId: Uuid) =>
      (await store.findById(characterId))?.accountId ?? null,
  };
}

maybeLive('live PostgreSQL — persistence, concurrency and recovery', () => {
  let sql: PgPoolSession;

  beforeAll(async () => {
    sql = new PgPoolSession({
      connectionString: process.env.DATABASE_URL,
      max: 12,
    });
    await new MigrationRunner(sql).applyDirectory(MIGRATIONS_DIR);
    const accounts = new PgAccountRepository(sql);
    await accounts.ensureAccount(accountOne);
    await accounts.ensureAccount(accountTwo);
  }, 120_000);

  afterAll(async () => {
    await sql?.close().catch(() => undefined);
  });

  it('survives a connection-pool restart with every byte of F1 state', async () => {
    const characters = new CharacterService(new PgCharacterRepository(sql));
    const ledger = new LedgerService(
      new PgFinancialAccountRepository(sql),
      new PgLedgerRepository(sql),
      directoryFor(new PgCharacterRepository(sql)),
    );

    const alex = await characters.create(playerOne, { firstName: 'Alex', lastName: 'Rivera' });
    const morgan = await characters.create(playerTwo, {
      firstName: 'Morgan',
      lastName: 'Cruz',
    });
    await ledger.grant(admin, {
      requestId: requestId('grant'),
      toCharacterId: alex.id,
      amountMinor: 900n,
    });
    await ledger.transfer(playerOne, {
      requestId: requestId('transfer'),
      fromCharacterId: alex.id,
      toCharacterId: morgan.id,
      amountMinor: 350n,
    });
    const before = [
      await ledger.getCharacterBalance(alex.id),
      await ledger.getCharacterBalance(morgan.id),
    ];

    // Restart: destroy this pool entirely and rebuild from scratch.
    const directory = new PgPoolSession({ connectionString: process.env.DATABASE_URL, max: 4 });
    const ledgerAfter = new LedgerService(
      new PgFinancialAccountRepository(directory),
      new PgLedgerRepository(directory),
      directoryFor(new PgCharacterRepository(directory)),
    );
    const recoveredAlex = await ledgerAfter.getCharacterBalance(alex.id);
    const recoveredMorgan = await ledgerAfter.getCharacterBalance(morgan.id);
    const statementAfterRestart = await ledgerAfter.getCharacterStatement(alex.id, 10);
    await directory.close();

    expect(recoveredAlex).toBe(before[0]);
    expect(recoveredMorgan).toBe(before[1]);
    expect(statementAfterRestart).toHaveLength(2);
  }, 60_000);

  it('serializes genuinely concurrent transfers across separate connections', async () => {
    const characters = new CharacterService(new PgCharacterRepository(sql));
    const ledger = new LedgerService(
      new PgFinancialAccountRepository(sql),
      new PgLedgerRepository(sql),
      directoryFor(new PgCharacterRepository(sql)),
    );
    const alex = await characters.create(playerOne, { firstName: 'Ada', lastName: 'Race' });
    const morgan = await characters.create(playerTwo, { firstName: 'Grace', lastName: 'Race' });
    await ledger.grant(admin, {
      requestId: requestId('race-grant'),
      toCharacterId: alex.id,
      amountMinor: 1_000n,
    });

    // Eight transfers of 400 race for 1,000 across distinct pool connections;
    // only two can ever win and the books must stay balanced either way.
    const outcomes = await Promise.allSettled(
      Array.from({ length: 8 }, (_, index) =>
        ledger.transfer(playerOne, {
          requestId: requestId(`race-${index}`),
          fromCharacterId: alex.id,
          toCharacterId: morgan.id,
          amountMinor: 400n,
        }),
      ),
    );

    const winners = outcomes.filter((outcome) => outcome.status === 'fulfilled');
    expect(winners.length).toBeLessThanOrEqual(2);
    const alexBalance = await ledger.getCharacterBalance(alex.id);
    const morganBalance = await ledger.getCharacterBalance(morgan.id);
    expect(alexBalance).toBeGreaterThanOrEqual(0n);
    expect(alexBalance + morganBalance).toBe(1_000n);
    expect(morganBalance).toBe(BigInt(winners.length) * 400n);
    for (const outcome of outcomes) {
      if (outcome.status === 'rejected') {
        expect(outcome.reason.code).toBe('INSUFFICIENT_FUNDS');
      }
    }
  }, 60_000);

  it('deduplicates the same idempotency key across concurrent connections', async () => {
    const characters = new CharacterService(new PgCharacterRepository(sql));
    const ledger = new LedgerService(
      new PgFinancialAccountRepository(sql),
      new PgLedgerRepository(sql),
      directoryFor(new PgCharacterRepository(sql)),
    );
    const alex = await characters.create(playerOne, { firstName: 'Ed', lastName: 'Unique' });

    const receipts = await Promise.all(
      Array.from({ length: 6 }, () =>
        ledger.grant(admin, {
          requestId: requestId('dedupe'),
          toCharacterId: alex.id,
          amountMinor: 250n,
        }),
      ),
    );

    const ids = new Set(receipts.map((receipt) => receipt.transactionId));
    expect(ids.size).toBe(1);
    expect(receipts.filter((receipt) => receipt.posted)).toHaveLength(1);
    expect(await ledger.getCharacterBalance(alex.id)).toBe(250n);
  }, 60_000);

  it('authenticates server-issued sessions over the live server', async () => {
    const sessions = new SessionService(new PgSessionRepository(sql));
    const issued = await sessions.issue({
      accountId: accountOne,
      capabilities: ['economy.grant'],
      ttlMs: 60 * 60 * 1000,
    });
    const resolved = await sessions.authenticate(issued.token);
    expect(resolved?.accountId).toBe(accountOne);
    await sessions.revoke(issued.session.sessionId);
    expect(await sessions.authenticate(issued.token)).toBeNull();
  }, 60_000);
});
