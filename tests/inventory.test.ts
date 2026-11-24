import { describe, expect, it } from 'vitest';
import { DomainError, InMemoryInventory, InMemoryRoleplay } from '@gta6-rp/core';
import type { AccountId, CharacterId, Principal } from '@gta6-rp/core';

const accountA = 'account-a' as AccountId;
const accountB = 'account-b' as AccountId;
const characterA = 'character-a' as CharacterId;
const characterB = 'character-b' as CharacterId;
const userA: Principal = { accountId: accountA, capabilities: [] };
const userB: Principal = { accountId: accountB, capabilities: [] };
const staff: Principal = { accountId: accountA, capabilities: ['inventory.mint'] };

function seeded(capacityGrams = 30_000): InMemoryInventory {
  const characters = new InMemoryRoleplay();
  characters.registerCharacter(userA, {
    id: characterA, accountId: accountA, displayName: 'Alex Rivera',
  });
  characters.registerCharacter(userB, {
    id: characterB, accountId: accountB, displayName: 'Morgan Cruz',
  });
  const inventory = new InMemoryInventory((id) => characters.getCharacter(id), capacityGrams);
  inventory.registerItem({
    id: 'water', displayName: 'Bottled water', weightGrams: 500,
    maxStack: 10, tradeable: true,
  });
  inventory.registerItem({
    id: 'id-card', displayName: 'Identity card', weightGrams: 10,
    maxStack: 1, tradeable: false,
  });
  return inventory;
}

function rejects(code: string, action: () => unknown): void {
  try {
    action();
    throw new Error('Expected domain error');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe(code);
  }
}

describe('inventory domain (reference only)', () => {
  it('requires a server-issued mint capability', () => {
    const inv = seeded();
    const command = { requestId: 'mint-1', to: characterA, itemId: 'water', count: 2 };
    rejects('FORBIDDEN', () => inv.mint(userA, command));
    expect(inv.mint(staff, command).operation).toBe('mint');
    expect(inv.getCount(characterA, 'water')).toBe(2);
  });

  it('enforces authenticated source ownership', () => {
    const inv = seeded();
    inv.mint(staff, { requestId: 'seed', to: characterA, itemId: 'water', count: 3 });
    rejects('FORBIDDEN', () => inv.transfer(userB, {
      requestId: 'steal', from: characterA, to: characterB, itemId: 'water', count: 1,
    }));
    rejects('FORBIDDEN', () => inv.consume(userB, {
      requestId: 'consume', from: characterA, itemId: 'water', count: 1,
    }));
    expect(inv.getCount(characterA, 'water')).toBe(3);
  });

  it('replays exact requests once and rejects modified reuse', () => {
    const inv = seeded();
    const cmd = { requestId: 'once', to: characterA, itemId: 'water', count: 2 };
    const first = inv.mint(staff, cmd);
    expect(inv.mint(staff, cmd)).toBe(first);
    rejects('IDEMPOTENCY_CONFLICT', () => inv.mint(staff, { ...cmd, count: 3 }));
    expect(inv.getCount(characterA, 'water')).toBe(2);
    expect(inv.getLedger()).toHaveLength(1);
  });

  it('moves items without duplication and supports consumption', () => {
    const inv = seeded();
    inv.mint(staff, { requestId: 'seed', to: characterA, itemId: 'water', count: 4 });
    const move = {
      requestId: 'transfer', from: characterA, to: characterB, itemId: 'water', count: 3,
    };
    expect(inv.transfer(userA, move)).toBe(inv.transfer(userA, move));
    inv.consume(userB, {
      requestId: 'drink', from: characterB, itemId: 'water', count: 1,
    });
    expect(inv.getCount(characterA, 'water')).toBe(1);
    expect(inv.getCount(characterB, 'water')).toBe(2);
    expect(inv.getWeight(characterB)).toBe(1_000);
    expect(inv.getLedger()).toHaveLength(3);
  });

  it('rejects self-transfers, overdrafts and non-tradeable items', () => {
    const inv = seeded();
    inv.mint(staff, { requestId: 'id', to: characterA, itemId: 'id-card', count: 1 });
    rejects('SELF_TRANSFER', () => inv.transfer(userA, {
      requestId: 'self', from: characterA, to: characterA, itemId: 'water', count: 1,
    }));
    rejects('NOT_TRADEABLE', () => inv.transfer(userA, {
      requestId: 'id-move', from: characterA, to: characterB, itemId: 'id-card', count: 1,
    }));
    rejects('INSUFFICIENT_ITEMS', () => inv.transfer(userA, {
      requestId: 'empty', from: characterA, to: characterB, itemId: 'water', count: 1,
    }));
    expect(inv.getCount(characterA, 'id-card')).toBe(1);
  });

  it('checks receiver capacity and per-item stack before debiting source', () => {
    const inv = seeded(1_000);
    inv.mint(staff, { requestId: 'seed-a', to: characterA, itemId: 'water', count: 2 });
    inv.mint(staff, { requestId: 'seed-b', to: characterB, itemId: 'water', count: 1 });
    rejects('CAPACITY_LIMIT', () => inv.transfer(userA, {
      requestId: 'overweight', from: characterA, to: characterB, itemId: 'water', count: 2,
    }));
    expect(inv.getCount(characterA, 'water')).toBe(2);
    expect(inv.getCount(characterB, 'water')).toBe(1);
    const normal = seeded();
    normal.mint(staff, { requestId: 'full', to: characterA, itemId: 'water', count: 10 });
    rejects('STACK_LIMIT', () => normal.mint(staff, {
      requestId: 'too-many', to: characterA, itemId: 'water', count: 1,
    }));
    expect(normal.getCount(characterA, 'water')).toBe(10);
  });

  it('validates bounded integer quantities and registered identities', () => {
    const inv = seeded();
    rejects('INVALID_QUANTITY', () => inv.mint(staff, {
      requestId: 'fraction', to: characterA, itemId: 'water', count: 1.5,
    }));
    rejects('INVALID_QUANTITY', () => inv.mint(staff, {
      requestId: 'negative', to: characterA, itemId: 'water', count: -1,
    }));
    rejects('ITEM_NOT_FOUND', () => inv.mint(staff, {
      requestId: 'missing', to: characterA, itemId: 'unknown', count: 1,
    }));
    rejects('CHARACTER_NOT_FOUND', () => inv.mint(staff, {
      requestId: 'owner', to: 'missing' as CharacterId, itemId: 'water', count: 1,
    }));
  });

  it('defensively freezes public snapshots and receipts', () => {
    const inv = seeded();
    const receipt = inv.mint(staff, {
      requestId: 'mint-1', to: characterA, itemId: 'water', count: 1,
    });
    const list = inv.list(characterA);
    expect(Object.isFrozen(list)).toBe(true);
    expect(Object.isFrozen(list[0])).toBe(true);
    expect(Object.isFrozen(receipt)).toBe(true);
    expect(Object.isFrozen(inv.getLedger())).toBe(true);
    expect(list).toEqual([{ itemId: 'water', count: 1 }]);
  });

  it('rejects duplicate definitions and invalid capacities', () => {
    const inv = seeded();
    rejects('ITEM_EXISTS', () => inv.registerItem({
      id: 'water', displayName: 'Other water', weightGrams: 1,
      maxStack: 10, tradeable: true,
    }));
    rejects('INVALID_QUANTITY', () => new InMemoryInventory(() => undefined, 0));
  });
});
