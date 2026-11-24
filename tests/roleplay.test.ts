import { describe, expect, it } from 'vitest';
import { DomainError, InMemoryRoleplay } from '@gta6-rp/core';
import type { AccountId, CharacterId, Principal } from '@gta6-rp/core';

const a = 'account-a' as AccountId;
const b = 'account-b' as AccountId;
const x = 'character-x' as CharacterId;
const y = 'character-y' as CharacterId;
const userA: Principal = { accountId: a, capabilities: [] };
const userB: Principal = { accountId: b, capabilities: [] };
const admin: Principal = { accountId: a, capabilities: ['economy.grant'] };

function seeded(): InMemoryRoleplay {
  const world = new InMemoryRoleplay();
  world.registerCharacter(userA, { id: x, accountId: a, displayName: 'Alex Rivera' });
  world.registerCharacter(userB, { id: y, accountId: b, displayName: 'Morgan Cruz' });
  return world;
}

function failsWith(code: string, work: () => unknown): void {
  try {
    work();
    throw new Error('Expected a domain error');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe(code);
  }
}

describe('portable roleplay reference domain', () => {
  it('binds new characters to the trusted principal and rejects duplicates', () => {
    const world = seeded();
    expect(world.getBalance(x)).toBe(0n);
    failsWith('FORBIDDEN', () =>
      world.registerCharacter(userA, {
        id: 'imposter' as CharacterId,
        accountId: b,
        displayName: 'Not Allowed',
      }),
    );
    failsWith('CHARACTER_EXISTS', () =>
      world.registerCharacter(userA, {
        id: x,
        accountId: a,
        displayName: 'Again',
      }),
    );
  });
  it('rejects invalid identifiers and invalid names', () => {
    const world = seeded();
    failsWith('INVALID_IDENTIFIER', () =>
      world.registerCharacter(userA, {
        id: '../etc' as CharacterId,
        accountId: a,
        displayName: 'Wrong ID',
      }),
    );
    failsWith('INVALID_NAME', () =>
      world.registerCharacter(userA, {
        id: 'character-z' as CharacterId,
        accountId: a,
        displayName: ' ',
      }),
    );
  });
  it('denies unprivileged grants and bounds amounts', () => {
    const world = seeded();
    failsWith('FORBIDDEN', () => world.grant(userA, { requestId: 'r1', to: x, amount: 100n }));
    failsWith('INVALID_AMOUNT', () => world.grant(admin, { requestId: 'r1', to: x, amount: 0n }));
    failsWith('INVALID_AMOUNT', () => world.grant(admin, { requestId: 'r1', to: x, amount: -1n }));
    expect(world.getLedger()).toHaveLength(0);
  });
  it('returns exactly the same receipt for a retry without double-credit', () => {
    const world = seeded();
    const command = { requestId: 'credit-001', to: x, amount: 2000n };
    const first = world.grant(admin, command);
    expect(world.grant(admin, command)).toBe(first);
    expect(world.getBalance(x)).toBe(2000n);
    expect(world.getLedger()).toHaveLength(1);
  });
  it('rejects a reused idempotency key with different payload', () => {
    const world = seeded();
    world.grant(admin, { requestId: 'reused', to: x, amount: 100n });
    failsWith('IDEMPOTENCY_CONFLICT', () =>
      world.grant(admin, {
        requestId: 'reused',
        to: x,
        amount: 200n,
      }),
    );
    expect(world.getBalance(x)).toBe(100n);
  });
  it('transfers only by the sending character account', () => {
    const world = seeded();
    world.grant(admin, { requestId: 'seed', to: x, amount: 500n });
    failsWith('FORBIDDEN', () =>
      world.transfer(userB, {
        requestId: 'attempt',
        from: x,
        to: y,
        amount: 10n,
      }),
    );
    expect(world.getBalance(x)).toBe(500n);
  });
  it('rejects overdrafts and self-transfers without changing balances', () => {
    const world = seeded();
    failsWith('INSUFFICIENT_FUNDS', () =>
      world.transfer(userA, {
        requestId: 'overdraft',
        from: x,
        to: y,
        amount: 1n,
      }),
    );
    failsWith('SELF_TRANSFER', () =>
      world.transfer(userA, {
        requestId: 'self',
        from: x,
        to: x,
        amount: 1n,
      }),
    );
    expect(world.getLedger()).toHaveLength(0);
  });
  it('performs a transfer once and records an immutable ledger', () => {
    const world = seeded();
    world.grant(admin, { requestId: 'seed', to: x, amount: 500n });
    const command = { requestId: 'pay', from: x, to: y, amount: 125n };
    const receipt = world.transfer(userA, command);
    expect(world.transfer(userA, command)).toBe(receipt);
    expect([world.getBalance(x), world.getBalance(y)]).toEqual([375n, 125n]);
    expect(world.getLedger()).toHaveLength(2);
    expect(Object.isFrozen(receipt)).toBe(true);
    expect(Object.isFrozen(world.getLedger())).toBe(true);
  });
  it('rejects unknown recipients and excessive credits', () => {
    const world = seeded();
    failsWith('CHARACTER_NOT_FOUND', () =>
      world.grant(admin, {
        requestId: 'missing',
        to: 'unknown' as CharacterId,
        amount: 1n,
      }),
    );
    failsWith('INVALID_AMOUNT', () =>
      world.grant(admin, {
        requestId: 'large',
        to: x,
        amount: 1_000_000_000_001n,
      }),
    );
  });
});
