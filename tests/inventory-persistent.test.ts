import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { newUuid } from '@gta6-rp/core';
import { CharacterService, DomainError, PersistentInventoryService } from '@gta6-rp/core';
import type {
  CharacterOwnershipDirectory,
  CharacterStore,
  PersistentInventoryContainer,
  SessionPrincipal,
  Uuid,
} from '@gta6-rp/core';
import { runPersistentInventoryRoleplayScenario } from '@gta6-rp/simulator';
import {
  PgAccountRepository,
  PgCharacterRepository,
  PgInventoryRepository,
} from '@gta6-rp/persistence';

import { openDatabase, reopenDatabase, type TestDatabase } from './helpers/database.js';

const accountOne = newUuid();
const accountTwo = newUuid();
const admin: SessionPrincipal = { accountId: accountOne, capabilities: ['inventory.mint'] };
const playerOne: SessionPrincipal = { accountId: accountOne, capabilities: [] };
const playerTwo: SessionPrincipal = { accountId: accountTwo, capabilities: [] };

function directoryFor(store: CharacterStore): CharacterOwnershipDirectory {
  return {
    findOwnerAccount: async (characterId: Uuid) =>
      (await store.findById(characterId))?.accountId ?? null,
  };
}

async function failsWith(code: string, work: () => unknown | Promise<unknown>): Promise<void> {
  try {
    await work();
    throw new Error('Expected a domain error');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe(code);
  }
}

describe('persistent inventory service — PostgreSQL embedded engine', () => {
  let database: TestDatabase;
  let characters: PgCharacterRepository;
  let characterService: CharacterService;
  let inventory: PgInventoryRepository;
  let service: PersistentInventoryService;
  let alexId: Uuid;
  let morganId: Uuid;
  let alexCharacterContainer: PersistentInventoryContainer;
  let morganCharacterContainer: PersistentInventoryContainer;
  let vehicleContainer: PersistentInventoryContainer;

  beforeAll(async () => {
    database = await openDatabase();
    await new PgAccountRepository(database.sql).ensureAccount(accountOne);
    await new PgAccountRepository(database.sql).ensureAccount(accountTwo);
    characters = new PgCharacterRepository(database.sql);
    characterService = new CharacterService(characters);
    inventory = new PgInventoryRepository(database.sql);
    service = new PersistentInventoryService(inventory, directoryFor(characters));
    await inventory.registerItemDefinition({
      id: 'test:parcel',
      displayName: 'Synthetic parcel',
      weightGrams: 10,
      maxStack: 5,
      tradeable: true,
    });
    await inventory.registerItemDefinition({
      id: 'test:bound',
      displayName: 'Bound synthetic item',
      weightGrams: 10,
      maxStack: 5,
      tradeable: false,
    });
  });

  beforeEach(async () => {
    const alex = await characterService.create(playerOne, {
      firstName: 'Alex',
      lastName: 'Rivera',
    });
    const morgan = await characterService.create(playerTwo, {
      firstName: 'Morgan',
      lastName: 'Cruz',
    });
    alexId = alex.id;
    morganId = morgan.id;
    alexCharacterContainer = await inventory.createContainer({
      id: newUuid(),
      kind: 'character',
      locationId: alex.id,
      ownerCharacterId: alex.id,
      slotCapacity: 20,
      weightCapacityGrams: 2_000,
    });
    morganCharacterContainer = await inventory.createContainer({
      id: newUuid(),
      kind: 'character',
      locationId: morgan.id,
      ownerCharacterId: morgan.id,
      slotCapacity: 20,
      weightCapacityGrams: 2_000,
    });
    vehicleContainer = await inventory.createContainer({
      id: newUuid(),
      kind: 'vehicle',
      locationId: newUuid(),
      ownerCharacterId: alex.id,
      slotCapacity: 20,
      weightCapacityGrams: 2_000,
    });
  });

  afterAll(async () => {
    await database?.dispose();
  });

  it('mints once, returns the original receipt on retry and rejects a changed fingerprint', async () => {
    const command = {
      requestId: 'persistent-mint-retry',
      toContainerId: vehicleContainer.id,
      toCharacterId: alexId,
      itemId: 'test:parcel',
      quantity: 2,
    };
    const receipt = await service.mint(admin, command);
    const replay = await service.mint(admin, command);

    expect(replay).toEqual(receipt);
    expect(await inventory.listContainerStacks(vehicleContainer.id)).toMatchObject([
      { ownerCharacterId: alexId, itemId: 'test:parcel', quantity: 2 },
    ]);
    await failsWith('IDEMPOTENCY_CONFLICT', () => service.mint(admin, { ...command, quantity: 3 }));
  });

  it('moves without changing ownership, consumes atomically and records an actual trade', async () => {
    await service.mint(admin, {
      requestId: 'scenario-seed',
      toContainerId: vehicleContainer.id,
      toCharacterId: alexId,
      itemId: 'test:parcel',
      quantity: 4,
    });
    const moved = await service.move(playerOne, {
      requestId: 'scenario-move',
      actorCharacterId: alexId,
      fromContainerId: vehicleContainer.id,
      toContainerId: alexCharacterContainer.id,
      itemId: 'test:parcel',
      quantity: 2,
    });
    expect(moved.movement.sourceOwnerCharacterId).toBe(alexId);
    expect(moved.movement.destinationOwnerCharacterId).toBe(alexId);
    expect((await inventory.listContainerStacks(alexCharacterContainer.id))[0]).toMatchObject({
      ownerCharacterId: alexId,
      quantity: 2,
    });

    await service.consume(playerOne, {
      requestId: 'scenario-consume',
      actorCharacterId: alexId,
      fromContainerId: alexCharacterContainer.id,
      itemId: 'test:parcel',
      quantity: 1,
    });
    const transferred = await service.transfer(playerOne, {
      requestId: 'scenario-transfer',
      actorCharacterId: alexId,
      fromContainerId: alexCharacterContainer.id,
      toContainerId: morganCharacterContainer.id,
      toCharacterId: morganId,
      itemId: 'test:parcel',
      quantity: 1,
    });

    expect(transferred.movement.sourceOwnerCharacterId).toBe(alexId);
    expect(transferred.movement.destinationOwnerCharacterId).toBe(morganId);
    expect(await inventory.listContainerStacks(alexCharacterContainer.id)).toEqual([]);
    expect(await inventory.listContainerStacks(morganCharacterContainer.id)).toMatchObject([
      { ownerCharacterId: morganId, itemId: 'test:parcel', quantity: 1 },
    ]);
  });

  it('runs CALM carried, vehicle-storage and trade behavior through the simulator', async () => {
    const scenario = await runPersistentInventoryRoleplayScenario({
      service,
      adminPrincipal: admin,
      playerPrincipal: playerOne,
      playerCharacterId: alexId,
      recipientCharacterId: morganId,
      carriedContainerId: alexCharacterContainer.id,
      vehicleContainerId: vehicleContainer.id,
      recipientContainerId: morganCharacterContainer.id,
      itemId: 'test:parcel',
      requestIdPrefix: `simulator-${newUuid()}`,
    });

    expect(scenario.storedInVehicle.movement.sourceOwnerCharacterId).toBe(alexId);
    expect(scenario.storedInVehicle.movement.destinationOwnerCharacterId).toBe(alexId);
    expect(scenario.retrievedFromVehicle.movement.sourceOwnerCharacterId).toBe(alexId);
    expect(scenario.transferred.movement.destinationOwnerCharacterId).toBe(morganId);
    expect(await inventory.listContainerStacks(alexCharacterContainer.id)).toMatchObject([
      { ownerCharacterId: alexId, itemId: 'test:parcel', quantity: 1 },
    ]);
    expect(await inventory.listContainerStacks(vehicleContainer.id)).toMatchObject([
      { ownerCharacterId: alexId, itemId: 'test:parcel', quantity: 1 },
    ]);
    expect(await inventory.listContainerStacks(morganCharacterContainer.id)).toMatchObject([
      { ownerCharacterId: morganId, itemId: 'test:parcel', quantity: 1 },
    ]);
  });

  it('rejects forged ownership, unauthorized sessions, self-trades and non-tradeable items', async () => {
    await service.mint(admin, {
      requestId: 'bound-seed',
      toContainerId: vehicleContainer.id,
      toCharacterId: alexId,
      itemId: 'test:bound',
      quantity: 2,
    });

    await failsWith('FORBIDDEN', () =>
      service.consume(playerTwo, {
        requestId: 'forged-actor',
        actorCharacterId: alexId,
        fromContainerId: vehicleContainer.id,
        itemId: 'test:bound',
        quantity: 1,
      }),
    );
    await failsWith('SELF_TRANSFER', () =>
      service.transfer(playerOne, {
        requestId: 'self-transfer',
        actorCharacterId: alexId,
        fromContainerId: vehicleContainer.id,
        toContainerId: alexCharacterContainer.id,
        toCharacterId: alexId,
        itemId: 'test:bound',
        quantity: 1,
      }),
    );
    await failsWith('NOT_TRADEABLE', () =>
      service.transfer(playerOne, {
        requestId: 'bound-transfer',
        actorCharacterId: alexId,
        fromContainerId: vehicleContainer.id,
        toContainerId: morganCharacterContainer.id,
        toCharacterId: morganId,
        itemId: 'test:bound',
        quantity: 1,
      }),
    );
    await failsWith('INSUFFICIENT_ITEMS', () =>
      service.consume(playerOne, {
        requestId: 'insufficient-items',
        actorCharacterId: alexId,
        fromContainerId: vehicleContainer.id,
        itemId: 'test:bound',
        quantity: 3,
      }),
    );
    expect(await inventory.listContainerStacks(vehicleContainer.id)).toMatchObject([
      { ownerCharacterId: alexId, itemId: 'test:bound', quantity: 2 },
    ]);
  });

  it('enforces max-stack splitting, slots and weight, with no partial writes on failure', async () => {
    const singleSlot = await inventory.createContainer({
      id: newUuid(),
      kind: 'property',
      locationId: newUuid(),
      ownerCharacterId: alexId,
      slotCapacity: 1,
      weightCapacityGrams: 100,
    });
    await service.mint(admin, {
      requestId: 'single-slot-fill',
      toContainerId: singleSlot.id,
      toCharacterId: alexId,
      itemId: 'test:parcel',
      quantity: 5,
    });
    await failsWith('CAPACITY_LIMIT', () =>
      service.mint(admin, {
        requestId: 'single-slot-overflow',
        toContainerId: singleSlot.id,
        toCharacterId: alexId,
        itemId: 'test:parcel',
        quantity: 1,
      }),
    );
    expect(await inventory.listContainerStacks(singleSlot.id)).toMatchObject([
      { itemId: 'test:parcel', quantity: 5 },
    ]);

    const lowWeight = await inventory.createContainer({
      id: newUuid(),
      kind: 'warehouse',
      locationId: newUuid(),
      ownerCharacterId: alexId,
      slotCapacity: 10,
      weightCapacityGrams: 20,
    });
    await failsWith('CAPACITY_LIMIT', () =>
      service.mint(admin, {
        requestId: 'weight-overflow',
        toContainerId: lowWeight.id,
        toCharacterId: alexId,
        itemId: 'test:parcel',
        quantity: 3,
      }),
    );
    expect(await inventory.listContainerStacks(lowWeight.id)).toEqual([]);
    const failedOperation = await database.sql.query(
      'SELECT id FROM inventory_operations WHERE idempotency_key IN ($1, $2)',
      ['single-slot-overflow', 'weight-overflow'],
    );
    expect(failedOperation.rows).toEqual([]);
  });

  it('canonicalizes metadata for idempotency and rejects malformed or oversized metadata', async () => {
    const first = await service.mint(admin, {
      requestId: 'metadata-retry',
      toContainerId: vehicleContainer.id,
      toCharacterId: alexId,
      itemId: 'test:parcel',
      quantity: 1,
      metadata: { quality: 'sealed', details: { variant: 2, batch: 'A' } },
    });
    const samePayload = await service.mint(admin, {
      requestId: 'metadata-retry',
      toContainerId: vehicleContainer.id,
      toCharacterId: alexId,
      itemId: 'test:parcel',
      quantity: 1,
      metadata: { details: { batch: 'A', variant: 2 }, quality: 'sealed' },
    });
    expect(samePayload).toEqual(first);
    await failsWith('IDEMPOTENCY_CONFLICT', () =>
      service.mint(admin, {
        requestId: 'metadata-retry',
        toContainerId: vehicleContainer.id,
        toCharacterId: alexId,
        itemId: 'test:parcel',
        quantity: 1,
        metadata: { quality: 'opened' },
      }),
    );
    await failsWith('INVALID_METADATA', () =>
      service.mint(admin, {
        requestId: 'bad-metadata',
        toContainerId: vehicleContainer.id,
        toCharacterId: alexId,
        itemId: 'test:parcel',
        quantity: 1,
        metadata: { note: 'x'.repeat(4_100) },
      }),
    );
    await failsWith('FORBIDDEN', () =>
      service.mint(playerOne, {
        requestId: 'missing-capability',
        toContainerId: vehicleContainer.id,
        toCharacterId: alexId,
        itemId: 'test:parcel',
        quantity: 1,
      }),
    );
  });
});

describe('persistent inventory restart recovery', () => {
  it('reopens the database and returns the original idempotent receipt', async () => {
    let database: TestDatabase = await openDatabase();
    try {
      const accountId = newUuid();
      const player: SessionPrincipal = { accountId, capabilities: [] };
      const admin: SessionPrincipal = { accountId, capabilities: ['inventory.mint'] };
      await new PgAccountRepository(database.sql).ensureAccount(accountId);

      const characters = new PgCharacterRepository(database.sql);
      const character = await new CharacterService(characters).create(player, {
        firstName: 'Taylor',
        lastName: 'Restart',
      });
      const inventory = new PgInventoryRepository(database.sql);
      await inventory.registerItemDefinition({
        id: 'test:restart-parcel',
        displayName: 'Restart parcel',
        weightGrams: 25,
        maxStack: 10,
        tradeable: true,
      });
      const container = await inventory.createContainer({
        id: newUuid(),
        kind: 'character',
        locationId: character.id,
        ownerCharacterId: character.id,
        slotCapacity: 10,
        weightCapacityGrams: 1_000,
      });
      const command = {
        requestId: `inventory-restart-${newUuid()}`,
        toContainerId: container.id,
        toCharacterId: character.id,
        itemId: 'test:restart-parcel',
        quantity: 3,
        metadata: { source: 'synthetic restart fixture' },
      };
      const service = new PersistentInventoryService(inventory, directoryFor(characters));
      const originalReceipt = await service.mint(admin, command);
      const databaseDirectory = database.directory;

      await database.close();
      database = await reopenDatabase(databaseDirectory);

      const restartedCharacters = new PgCharacterRepository(database.sql);
      const restartedInventory = new PgInventoryRepository(database.sql);
      const restartedService = new PersistentInventoryService(
        restartedInventory,
        directoryFor(restartedCharacters),
      );
      const replayedReceipt = await restartedService.mint(admin, command);
      const stacks = await restartedInventory.listContainerStacks(container.id);
      const operations = await database.sql.query(
        'SELECT COUNT(*) AS count FROM inventory_operations WHERE idempotency_key = $1',
        [command.requestId],
      );

      expect(replayedReceipt).toEqual(originalReceipt);
      expect(stacks).toMatchObject([
        { ownerCharacterId: character.id, itemId: 'test:restart-parcel', quantity: 3 },
      ]);
      expect(String(operations.rows[0]?.['count'])).toBe('1');
    } finally {
      await database.dispose();
    }
  });
});
