import { describe, expect, it } from 'vitest';
import { WorldPlanningCatalog, type PlannedLocation } from '../packages/core/src/world-planning.js';

const square: PlannedLocation = {
  id: 'district_alpha',
  spaceId: 'space_a',
  label: '  Test district  ',
  layer: 'exterior',
  use: 'region',
  status: 'reviewed',
  provenance: 'synthetic',
  position: { x: 0, y: 0, z: 0 },
  bounds: { min: { x: -10, y: -10, z: -2 }, max: { x: 10, y: 10, z: 4 } },
};

const lobby: PlannedLocation = {
  id: 'lobby_alpha',
  spaceId: 'space_b',
  label: 'Fictional lobby',
  layer: 'interior',
  use: 'public-service',
  status: 'draft',
  provenance: 'synthetic',
  parentId: square.id,
  position: { x: 0, y: 0, z: 0 },
};

describe('game-independent world planning', () => {
  it('indexes bounds and point-only locations by independent coordinate space', () => {
    const catalog = new WorldPlanningCatalog([square, lobby]);

    expect(catalog.at('space_a', { x: 10, y: 10, z: 4 }).map((value) => value.id)).toEqual([
      'district_alpha',
    ]);
    expect(catalog.at('space_a', { x: 11, y: 0, z: 0 })).toEqual([]);
    expect(catalog.at('space_a', { x: 0, y: 0, z: 0 }, { layer: 'interior' })).toEqual([]);
    expect(catalog.at('space_b', { x: 0, y: 0, z: 0 }).map((value) => value.id)).toEqual([
      'lobby_alpha',
    ]);
    expect(catalog.at('space_b', { x: 1, y: 0, z: 0 })).toEqual([]);
  });

  it('filters reviewed locations independently of conceptual parents', () => {
    const catalog = new WorldPlanningCatalog([lobby, square]);

    expect(catalog.list({ status: 'reviewed' }).map((value) => value.id)).toEqual([
      'district_alpha',
    ]);
    expect(catalog.get('lobby_alpha')?.parentId).toBe('district_alpha');
    expect(catalog.nearby('space_a', { x: 0, y: 0, z: 0 }, 5)).toEqual([
      { location: catalog.get('district_alpha'), distance: 0 },
    ]);
    expect(catalog.nearby('space_b', { x: 0, y: 0, z: 0 }, 10, { status: 'reviewed' })).toEqual(
      [],
    );
  });

  it('rejects duplicate IDs, missing parents, cycles and malformed geometry', () => {
    expect(() => new WorldPlanningCatalog([square, square])).toThrow(/Duplicate/);
    expect(() => new WorldPlanningCatalog([{ ...lobby, parentId: 'missing_location' }])).toThrow(
      /Unknown planning parent/,
    );
    expect(() =>
      new WorldPlanningCatalog([{ ...square, parentId: lobby.id }, lobby]),
    ).toThrow(/Cyclic planning hierarchy/);
    expect(
      () =>
        new WorldPlanningCatalog([
          { ...square, position: { x: Infinity, y: 0, z: 0 } },
        ]),
    ).toThrow(/finite/);
    expect(() =>
      new WorldPlanningCatalog([
        {
          ...square,
          bounds: { min: { x: 5, y: 0, z: 0 }, max: { x: 0, y: 1, z: 1 } },
        },
      ]),
    ).toThrow(/ordered/);
    const catalog = new WorldPlanningCatalog([square]);
    expect(() => catalog.nearby('space_a', { x: 0, y: 0, z: 0 }, -1)).toThrow(/radius/);
    expect(() => catalog.at('space_a', { x: Number.NaN, y: 0, z: 0 })).toThrow(/finite/);
  });

  it('refuses external provenance and strips unknown input fields', () => {
    const untrusted = {
      ...square,
      provenance: 'third-party',
    } as unknown as PlannedLocation;
    expect(() => new WorldPlanningCatalog([untrusted])).toThrow(/provenance/);

    const extended = {
      ...square,
      modelHash: 'not-permitted',
    } as PlannedLocation;
    const catalog = new WorldPlanningCatalog([extended]);
    const location = catalog.get(square.id);
    expect(location).toBeDefined();
    expect(Object.keys(location ?? {})).not.toContain('modelHash');
  });

  it('copies and freezes its spatial records so callers cannot silently change the index', () => {
    const mutableBounds = {
      min: { x: -10, y: -10, z: -2 },
      max: { x: 10, y: 10, z: 4 },
    };
    const catalog = new WorldPlanningCatalog([{ ...square, bounds: mutableBounds }]);
    mutableBounds.max.x = 999;

    expect(catalog.at('space_a', { x: 500, y: 0, z: 0 })).toEqual([]);
    expect(Object.isFrozen(catalog.get(square.id)?.bounds?.max)).toBe(true);
    expect(catalog.get(square.id)?.label).toBe('Test district');
  });
});
