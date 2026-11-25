import { describe, expect, it } from 'vitest';

import { newUuid } from '@gta6-rp/core';
import { CharacterService, DomainError, InMemoryCharacterStore } from '@gta6-rp/core';
import type { CharacterStore, SessionPrincipal, Uuid } from '@gta6-rp/core';
import { PgAccountRepository, PgCharacterRepository } from '@gta6-rp/persistence';

import { MutableClock, openDatabase, reopenDatabase } from './helpers/database.js';

const accountOne = newUuid();
const accountTwo = newUuid();
const START = new Date('2026-11-25T12:00:00.000Z');

const principalOne: SessionPrincipal = { accountId: accountOne, capabilities: [] };
const principalTwo: SessionPrincipal = { accountId: accountTwo, capabilities: [] };

interface WorldHandle {
  readonly store: CharacterStore;
  readonly service: CharacterService;
  dispose(): Promise<void>;
}

const worldFactories: readonly [label: string, factory: () => Promise<WorldHandle>][] = [
  [
    'in-memory store',
    async () => {
      const store = new InMemoryCharacterStore({
        knownAccounts: [accountOne, accountTwo],
      });
      return {
        store,
        service: new CharacterService(store, { clock: new MutableClock(START) }),
        dispose: async () => undefined,
      };
    },
  ],
  [
    'PostgreSQL repository (embedded engine)',
    async () => {
      const database = await openDatabase();
      const accounts = new PgAccountRepository(database.sql);
      await accounts.ensureAccount(accountOne);
      await accounts.ensureAccount(accountTwo);
      const store = new PgCharacterRepository(database.sql);
      return {
        store,
        service: new CharacterService(store, { clock: new MutableClock(START) }),
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

for (const [label, createWorld] of worldFactories) {
  describe(`persistent characters — ${label}`, () => {
    it('creates a character bound to the session account and recovers it by id', async () => {
      const { service, dispose } = await createWorld();

      const character = await service.create(principalOne, {
        firstName: '  Alex  ',
        lastName: 'Rivera',
      });

      expect(character.accountId).toBe(accountOne);
      expect(character.firstName).toBe('Alex');
      expect(character.retiredAt).toBeNull();

      const recovered = await service.get(character.id);
      expect(recovered).toEqual(character);
      await dispose();
    });

    it('lists only the account’s own active characters', async () => {
      const { service, dispose } = await createWorld();
      const first = await service.create(principalOne, { firstName: 'Alex', lastName: 'Rivera' });
      await service.create(principalOne, { firstName: 'Morgan', lastName: 'Cruz' });
      await service.create(principalTwo, { firstName: 'Sam', lastName: 'Vega' });

      const owned = await service.listOwn(principalOne);
      // Creation order is not the property under test here — account
      // separation and retirement filtering are.
      expect([...owned.map((character) => character.lastName)].sort()).toEqual(['Cruz', 'Rivera']);
      expect((await service.listOwn(principalTwo)).map((c) => c.lastName)).toEqual(['Vega']);

      await service.retire(principalOne, first.id);
      expect((await service.listOwn(principalOne)).map((c) => c.lastName)).toEqual(['Cruz']);
      await dispose();
    });

    it('enforces ownership: another account cannot load, retire or mutate the character', async () => {
      const { service, dispose } = await createWorld();
      const character = await service.create(principalOne, {
        firstName: 'Alex',
        lastName: 'Rivera',
      });

      await expect(service.requireOwn(principalTwo, character.id)).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
      await expect(service.retire(principalTwo, character.id)).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
      // The owner still can.
      expect(await service.requireOwn(principalOne, character.id)).toEqual(character);
      await dispose();
    });

    it('validates names and identifiers before touching the store', async () => {
      const { service, dispose } = await createWorld();

      await failsWith('INVALID_NAME', () =>
        service.create(principalOne, { firstName: '   ', lastName: 'Rivera' }),
      );
      await failsWith('INVALID_NAME', () =>
        service.create(principalOne, { firstName: 'A'.repeat(65), lastName: 'Rivera' }),
      );
      await failsWith('INVALID_NAME', () =>
        service.create(principalOne, { firstName: 'Bad\u0000', lastName: 'Rivera' }),
      );
      await failsWith('INVALID_IDENTIFIER', () => service.get('not-a-uuid' as Uuid));
      await failsWith('CHARACTER_NOT_FOUND', () =>
        service.requireOwn(principalOne, newUuid() as Uuid),
      );
      await dispose();
    });

    it('rejects unknown accounts and duplicate character ids at the store level', async () => {
      const { store, service, dispose } = await createWorld();

      await failsWith('ACCOUNT_NOT_FOUND', () =>
        store.insert({
          id: newUuid(),
          accountId: newUuid(),
          firstName: 'No',
          lastName: 'Account',
          createdAt: new Date(START),
          retiredAt: null,
        }),
      );

      const character = await service.create(principalOne, {
        firstName: 'Alex',
        lastName: 'Rivera',
      });
      await failsWith('CHARACTER_EXISTS', () =>
        store.insert({
          ...character,
          firstName: 'Duplicate',
        }),
      );
      await dispose();
    });

    it('retires idempotently and keeps retired characters recoverable', async () => {
      const { service, dispose } = await createWorld();
      const character = await service.create(principalOne, {
        firstName: 'Alex',
        lastName: 'Rivera',
      });

      expect(await service.retire(principalOne, character.id)).toBe(true);
      expect(await service.retire(principalOne, character.id)).toBe(false);
      const recovered = await service.get(character.id);
      expect(recovered?.retiredAt).not.toBeNull();
      await dispose();
    });
  });
}

describe('persistent characters — restart survival (PostgreSQL)', () => {
  it('recovers a character created in one run, intact, in the next', async () => {
    const first = await openDatabase();
    await new PgAccountRepository(first.sql).ensureAccount(accountOne);
    const before = new CharacterService(new PgCharacterRepository(first.sql), {
      clock: new MutableClock(START),
    });
    const created = await before.create(principalOne, {
      firstName: 'Alex',
      lastName: 'Rivera',
    });
    await first.close();

    const reopened = await reopenDatabase(first.directory);
    const after = new CharacterService(new PgCharacterRepository(reopened.sql), {
      clock: new MutableClock(new Date('2026-11-25T20:00:00.000Z')),
    });
    const recovered = await after.get(created.id);
    const listed = await after.listOwn(principalOne);

    expect(recovered).toEqual(created);
    expect(listed).toEqual([created]);
    await reopened.dispose();
  });

  it('keeps retirement durable across restarts', async () => {
    const first = await openDatabase();
    await new PgAccountRepository(first.sql).ensureAccount(accountOne);
    const before = new CharacterService(new PgCharacterRepository(first.sql), {
      clock: new MutableClock(START),
    });
    const created = await before.create(principalOne, {
      firstName: 'Morgan',
      lastName: 'Cruz',
    });
    await before.retire(principalOne, created.id);
    await first.close();

    const reopened = await reopenDatabase(first.directory);
    const after = new CharacterService(new PgCharacterRepository(reopened.sql), {
      clock: new MutableClock(new Date('2026-11-25T20:00:00.000Z')),
    });

    expect((await after.get(created.id))?.retiredAt).not.toBeNull();
    expect(await after.listOwn(principalOne)).toEqual([]);
    await reopened.dispose();
  });
});
