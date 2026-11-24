import { describe, expect, it } from 'vitest';
import { SimulatorPlayerDirectory } from '@gta6-rp/simulator';
import type { PlayerId } from '@gta6-rp/core';

// Synthetic simulator fixtures only: these identifiers never correspond to a
// real game account, platform identity or GTA VI service.
const playerOne = 'player-sim-001' as PlayerId;
const playerTwo = 'player-sim-002' as PlayerId;

describe('simulator player directory', () => {
  it('makes a connected player retrievable with connected state', () => {
    const directory = new SimulatorPlayerDirectory();

    const connected = directory.connect(playerOne);

    expect(connected).toMatchObject({ id: playerOne, connected: true });
    expect(directory.get(playerOne)).toBe(connected);
  });

  it('returns undefined for a player that was never connected', () => {
    const directory = new SimulatorPlayerDirectory();

    expect(directory.get(playerOne)).toBeUndefined();
  });

  it('disconnects only the target player and leaves other players intact', () => {
    const directory = new SimulatorPlayerDirectory();
    directory.connect(playerOne);
    const other = directory.connect(playerTwo);

    directory.disconnect(playerOne);

    expect(directory.get(playerOne)).toBeUndefined();
    expect(directory.get(playerTwo)).toBe(other);
  });

  it('replaces the record deterministically when an ID reconnects', () => {
    const directory = new SimulatorPlayerDirectory();
    const first = directory.connect(playerOne);

    const second = directory.connect(playerOne);

    // Documented deterministic behaviour of the current implementation:
    // reconnecting an ID is a replace, not an error. The directory keeps one
    // record per ID, and the newly returned record object is the one served
    // afterwards. The previous object is stale.
    expect(second).not.toBe(first);
    expect(second).toMatchObject({ id: playerOne, connected: true });
    expect(directory.get(playerOne)).toBe(second);
  });

  it('tolerates disconnecting an unknown or already disconnected player', () => {
    const directory = new SimulatorPlayerDirectory();
    directory.connect(playerOne);
    directory.disconnect(playerOne);

    expect(() => directory.disconnect(playerOne)).not.toThrow();
    expect(() => directory.disconnect(playerTwo)).not.toThrow();
    expect(directory.get(playerOne)).toBeUndefined();
  });
});
