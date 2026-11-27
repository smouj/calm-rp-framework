import type {
  PersistentInventoryReceipt,
  PersistentInventoryService,
  SessionPrincipal,
  Uuid,
} from '@gta6-rp/core';

export interface PersistentInventoryRoleplayScenarioInput {
  readonly service: PersistentInventoryService;
  readonly adminPrincipal: SessionPrincipal;
  readonly playerPrincipal: SessionPrincipal;
  readonly playerCharacterId: Uuid;
  readonly recipientCharacterId: Uuid;
  readonly carriedContainerId: Uuid;
  readonly vehicleContainerId: Uuid;
  readonly recipientContainerId: Uuid;
  readonly itemId: string;
  readonly requestIdPrefix: string;
}

export interface PersistentInventoryRoleplayScenarioResult {
  readonly minted: PersistentInventoryReceipt;
  readonly storedInVehicle: PersistentInventoryReceipt;
  readonly retrievedFromVehicle: PersistentInventoryReceipt;
  readonly transferred: PersistentInventoryReceipt;
}

/** Synthetic CALM GTA VI RP inventory flow; this does not connect to a game runtime. */
export async function runPersistentInventoryRoleplayScenario(
  input: PersistentInventoryRoleplayScenarioInput,
): Promise<PersistentInventoryRoleplayScenarioResult> {
  const minted = await input.service.mint(input.adminPrincipal, {
    requestId: `${input.requestIdPrefix}:mint`,
    toContainerId: input.carriedContainerId,
    toCharacterId: input.playerCharacterId,
    itemId: input.itemId,
    quantity: 3,
  });

  const storedInVehicle = await input.service.move(input.playerPrincipal, {
    requestId: `${input.requestIdPrefix}:store`,
    actorCharacterId: input.playerCharacterId,
    fromContainerId: input.carriedContainerId,
    toContainerId: input.vehicleContainerId,
    itemId: input.itemId,
    quantity: 2,
  });

  const retrievedFromVehicle = await input.service.move(input.playerPrincipal, {
    requestId: `${input.requestIdPrefix}:retrieve`,
    actorCharacterId: input.playerCharacterId,
    fromContainerId: input.vehicleContainerId,
    toContainerId: input.carriedContainerId,
    itemId: input.itemId,
    quantity: 1,
  });

  const transferred = await input.service.transfer(input.playerPrincipal, {
    requestId: `${input.requestIdPrefix}:transfer`,
    actorCharacterId: input.playerCharacterId,
    fromContainerId: input.carriedContainerId,
    toContainerId: input.recipientContainerId,
    toCharacterId: input.recipientCharacterId,
    itemId: input.itemId,
    quantity: 1,
  });

  return Object.freeze({ minted, storedInVehicle, retrievedFromVehicle, transferred });
}
