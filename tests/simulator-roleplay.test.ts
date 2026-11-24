import { describe, expect, it } from 'vitest';
import { runRoleplayScenario } from '@gta6-rp/simulator';

describe('game-independent example flow', () => {
  it('executes a deterministic two-character money transfer with replay protection', () => {
    const state = runRoleplayScenario();
    expect(state.characters.map((character) => character.balanceMinor)).toEqual(['3750', '1250']);
    expect(state.ledgerEntries).toBe(2);
    expect(state.replayPrevented).toBe(true);
  });
});
