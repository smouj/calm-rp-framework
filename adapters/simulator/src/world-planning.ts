import { WorldPlanningCatalog, type PlannedLocation } from '@gta6-rp/core';

/**
 * Entirely fictional planning records, authored for deterministic tests.
 * These positions are not tied to any GTA VI coordinate system or assets.
 */
const sampleLocations: readonly PlannedLocation[] = [
  {
    id: 'civic_district',
    spaceId: 'sample_surface',
    label: 'Civic district',
    layer: 'exterior',
    use: 'region',
    status: 'reviewed',
    provenance: 'synthetic',
    position: { x: 0, y: 0, z: 0 },
    bounds: { min: { x: -100, y: -100, z: -10 }, max: { x: 100, y: 100, z: 50 } },
  },
  {
    id: 'medical_station',
    spaceId: 'sample_surface',
    label: 'Medical station',
    layer: 'exterior',
    use: 'public-service',
    status: 'reviewed',
    provenance: 'synthetic',
    parentId: 'civic_district',
    position: { x: 30, y: 10, z: 0 },
    bounds: { min: { x: 20, y: 0, z: -2 }, max: { x: 40, y: 20, z: 15 } },
  },
  {
    id: 'medical_lobby',
    spaceId: 'sample_lobby',
    label: 'Medical lobby concept',
    layer: 'interior',
    use: 'public-service',
    status: 'draft',
    provenance: 'synthetic',
    parentId: 'medical_station',
    position: { x: 0, y: 0, z: 0 },
    bounds: { min: { x: -8, y: -6, z: 0 }, max: { x: 8, y: 6, z: 4 } },
  },
  {
    id: 'public_market',
    spaceId: 'sample_surface',
    label: 'Public market',
    layer: 'exterior',
    use: 'business',
    status: 'draft',
    provenance: 'synthetic',
    parentId: 'civic_district',
    position: { x: -30, y: 15, z: 0 },
  },
];

export const createSampleWorldPlanningCatalog = (): WorldPlanningCatalog =>
  new WorldPlanningCatalog(sampleLocations);
