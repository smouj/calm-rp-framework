import { InMemoryRoleplay } from '@gta6-rp/core';
import type { AccountId, CharacterId, Principal } from '@gta6-rp/core';

export interface ScenarioResult {
  readonly characters: readonly { id: string; name: string; balanceMinor: string }[];
  readonly ledgerEntries: number;
  readonly replayPrevented: boolean;
}

/** Deterministic, game-independent RP economy exercise. No actual player connections. */
export function runRoleplayScenario(): ScenarioResult {
  const world = new InMemoryRoleplay();
  const accountA = 'demo-a' as AccountId;
  const accountB = 'demo-b' as AccountId;
  const alice = 'character-a' as CharacterId;
  const bob = 'character-b' as CharacterId;
  const operator: Principal = { accountId: accountA, capabilities: ['economy.grant'] };
  const player: Principal = { accountId: accountA, capabilities: [] };
  world.registerCharacter(player, { id: alice, accountId: accountA, displayName: 'Alex Rivera' });
  world.registerCharacter(
    { accountId: accountB, capabilities: [] },
    { id: bob, accountId: accountB, displayName: 'Morgan Cruz' },
  );
  world.grant(operator, { requestId: 'seed-001', to: alice, amount: 50_00n });
  const command = { requestId: 'transfer-001', from: alice, to: bob, amount: 12_50n };
  const first = world.transfer(player, command);
  const replay = world.transfer(player, command);
  return {
    characters: [
      { id: alice, name: 'Alex Rivera', balanceMinor: world.getBalance(alice).toString() },
      { id: bob, name: 'Morgan Cruz', balanceMinor: world.getBalance(bob).toString() },
    ],
    ledgerEntries: world.getLedger().length,
    replayPrevented: first === replay,
  };
}
