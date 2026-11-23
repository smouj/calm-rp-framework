import type { PlayerId } from '@gta6-rp/core';

export interface SimulatedPlayer {
  readonly id: PlayerId;
  readonly connected: boolean;
}

export class SimulatorPlayerDirectory {
  readonly #players = new Map<PlayerId, SimulatedPlayer>();

  public connect(id: PlayerId): SimulatedPlayer {
    const player: SimulatedPlayer = { id, connected: true };
    this.#players.set(id, player);
    return player;
  }

  public get(id: PlayerId): SimulatedPlayer | undefined {
    return this.#players.get(id);
  }

  public disconnect(id: PlayerId): void {
    this.#players.delete(id);
  }
}

export { createSampleWorldPlanningCatalog } from './world-planning.js';
