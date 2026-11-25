import { describe, expect, it } from 'vitest';

import { newUuid } from '@gta6-rp/core';
import {
  DomainError,
  InMemorySessionStore,
  SESSION_CAPABILITIES,
  SessionService,
} from '@gta6-rp/core';
import type { SessionStore, Uuid } from '@gta6-rp/core';
import { PgAccountRepository, PgSessionRepository } from '@gta6-rp/persistence';

import { MutableClock, openDatabase, reopenDatabase } from './helpers/database.js';

const accountOne = newUuid();
const accountTwo = newUuid();
const START = new Date('2026-11-25T12:00:00.000Z');

interface StoreHandle {
  readonly store: SessionStore;
  dispose(): Promise<void>;
}

const storeFactories: readonly [label: string, factory: () => Promise<StoreHandle>][] = [
  [
    'in-memory store',
    async () => ({ store: new InMemorySessionStore(), dispose: async () => undefined }),
  ],
  [
    'PostgreSQL repository (embedded engine)',
    async () => {
      const database = await openDatabase();
      const accounts = new PgAccountRepository(database.sql);
      await accounts.ensureAccount(accountOne);
      await accounts.ensureAccount(accountTwo);
      return { store: new PgSessionRepository(database.sql), dispose: database.close };
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

for (const [label, createStore] of storeFactories) {
  describe(`authenticated sessions — ${label}`, () => {
    it('resolves the issuing account from the token, never from the request', async () => {
      const { store, dispose } = await createStore();
      const clock = new MutableClock(START);
      const sessions = new SessionService(store, { clock });

      const issued = await sessions.issue({
        accountId: accountOne,
        capabilities: ['economy.grant'],
        ttlMs: 60 * 60 * 1000,
      });

      const resolved = await sessions.authenticate(issued.token);
      expect(resolved?.accountId).toBe(accountOne);
      expect(resolved?.capabilities).toEqual(['economy.grant']);
      expect(resolved?.sessionId).toBe(issued.session.sessionId);

      const principal = sessions.principalOf(resolved!);
      expect(principal).toEqual({ accountId: accountOne, capabilities: ['economy.grant'] });
      await dispose();
    });

    it('stores only the hash: presenting the stored hash is not a session token', async () => {
      const { store, dispose } = await createStore();
      const sessions = new SessionService(store, { clock: new MutableClock(START) });

      const issued = await sessions.issue({
        accountId: accountOne,
        capabilities: [],
        ttlMs: 60 * 60 * 1000,
      });

      expect(issued.session.tokenHash).not.toBe(issued.token);
      expect(issued.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
      await expect(sessions.authenticate(issued.session.tokenHash)).resolves.toBeNull();
      await expect(sessions.authenticate(`  ${issued.token}  `)).resolves.toMatchObject({
        accountId: accountOne,
      });
      await dispose();
    });

    it('rejects unknown, malformed and empty tokens', async () => {
      const { store, dispose } = await createStore();
      const sessions = new SessionService(store, { clock: new MutableClock(START) });

      await expect(sessions.authenticate('totally-unknown-token')).resolves.toBeNull();
      await expect(sessions.authenticate('')).resolves.toBeNull();
      await expect(sessions.authenticate('   ')).resolves.toBeNull();
      await expect(sessions.authenticate(`${newUuid()}`)).resolves.toBeNull();
      await dispose();
    });

    it('expires exactly at the deadline and stays valid one moment before', async () => {
      const { store, dispose } = await createStore();
      const clock = new MutableClock(START);
      const sessions = new SessionService(store, { clock });
      const ttlMs = 30 * 60 * 1000;

      const issued = await sessions.issue({ accountId: accountOne, capabilities: [], ttlMs });
      clock.advance(ttlMs - 1);
      await expect(sessions.authenticate(issued.token)).resolves.toMatchObject({
        accountId: accountOne,
      });
      clock.advance(1);
      await expect(sessions.authenticate(issued.token)).resolves.toBeNull();
      await dispose();
    });

    it('revokes sessions idempotently and rejects revoked tokens', async () => {
      const { store, dispose } = await createStore();
      const sessions = new SessionService(store, { clock: new MutableClock(START) });

      const issued = await sessions.issue({
        accountId: accountOne,
        capabilities: [],
        ttlMs: 60 * 60 * 1000,
      });

      await expect(sessions.revoke(issued.session.sessionId)).resolves.toBe(true);
      await expect(sessions.authenticate(issued.token)).resolves.toBeNull();
      await expect(sessions.revoke(issued.session.sessionId)).resolves.toBe(false);
      await expect(sessions.revoke(newUuid() as Uuid)).resolves.toBe(false);
      await dispose();
    });

    it('never lets one account resolve to another account', async () => {
      const { store, dispose } = await createStore();
      const sessions = new SessionService(store, { clock: new MutableClock(START) });

      const forOne = await sessions.issue({ accountId: accountOne, capabilities: [], ttlMs: 1000 });
      const forTwo = await sessions.issue({ accountId: accountTwo, capabilities: [], ttlMs: 1000 });

      expect((await sessions.authenticate(forTwo.token))?.accountId).toBe(accountTwo);
      expect((await sessions.authenticate(forOne.token))?.accountId).toBe(accountOne);
      // A token minted for accountTwo authenticates as accountTwo only —
      // the wire can carry no account identifier that would change that.
      await expect(sessions.authenticate(forTwo.token)).resolves.toMatchObject({
        accountId: accountTwo,
      });
      await dispose();
    });

    it('validates the issue command', async () => {
      const { store, dispose } = await createStore();
      const sessions = new SessionService(store, { clock: new MutableClock(START) });

      await expect(
        sessions.issue({
          accountId: 'not-a-uuid' as Uuid,
          capabilities: [],
          ttlMs: 60_000,
        }),
      ).rejects.toMatchObject({ code: 'INVALID_IDENTIFIER' });
      await failsWith('INVALID_TTL', () =>
        sessions.issue({ accountId: accountOne, capabilities: [], ttlMs: 999 }),
      );
      await expect(
        sessions.issue({
          accountId: accountOne,
          capabilities: ['economy.grant', 'not-a-capability' as 'economy.grant'],
          ttlMs: 60_000,
        }),
      ).rejects.toMatchObject({ code: 'INVALID_CAPABILITY' });
      expect(SESSION_CAPABILITIES).toContain('economy.grant');
      await dispose();
    });
  });
}

describe('authenticated sessions — restart survival (PostgreSQL)', () => {
  it('authenticates a token issued before a full engine restart', async () => {
    const first = await openDatabase();
    await new PgAccountRepository(first.sql).ensureAccount(accountOne);
    const sessions = new SessionService(new PgSessionRepository(first.sql), {
      clock: new MutableClock(START),
    });

    const issued = await sessions.issue({
      accountId: accountOne,
      capabilities: ['economy.grant'],
      ttlMs: 24 * 60 * 60 * 1000,
    });
    await first.close();

    const reopened = await reopenDatabase(first.directory);
    const afterRestart = new SessionService(new PgSessionRepository(reopened.sql), {
      clock: new MutableClock(new Date('2026-11-25T20:00:00.000Z')),
    });
    const resolved = await afterRestart.authenticate(issued.token);

    expect(resolved).toMatchObject({ accountId: accountOne, capabilities: ['economy.grant'] });
    expect(resolved?.sessionId).toBe(issued.session.sessionId);
    await reopened.close();
  });

  it('keeps revocation durable across a restart', async () => {
    const first = await openDatabase();
    await new PgAccountRepository(first.sql).ensureAccount(accountTwo);
    const sessions = new SessionService(new PgSessionRepository(first.sql), {
      clock: new MutableClock(START),
    });
    const issued = await sessions.issue({
      accountId: accountTwo,
      capabilities: [],
      ttlMs: 24 * 60 * 60 * 1000,
    });
    await sessions.revoke(issued.session.sessionId);
    await first.close();

    const reopened = await reopenDatabase(first.directory);
    const afterRestart = new SessionService(new PgSessionRepository(reopened.sql), {
      clock: new MutableClock(new Date('2026-11-25T20:00:00.000Z')),
    });

    await expect(afterRestart.authenticate(issued.token)).resolves.toBeNull();
    await reopened.close();
  });
});
