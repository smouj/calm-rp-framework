/**
 * Project-owned RP world-planning coordinates. This is NOT a GTA VI map format,
 * coordinate system, asset identifier or runtime adapter.
 */
export interface PlanningPoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface PlanningBounds {
  readonly min: PlanningPoint;
  readonly max: PlanningPoint;
}

export type PlanningLayer = 'exterior' | 'interior' | 'underground';
export type PlanningUse =
  'region' | 'business' | 'property' | 'public-service' | 'transport' | 'interaction';
export type PlanningStatus = 'draft' | 'reviewed';
export type PlanningProvenance = 'synthetic' | 'project-owned';

export interface PlannedLocation {
  readonly id: string;
  /** Identifies a single, internally defined coordinate space. Never a game map name. */
  readonly spaceId: string;
  readonly label: string;
  readonly layer: PlanningLayer;
  readonly use: PlanningUse;
  readonly status: PlanningStatus;
  readonly provenance: PlanningProvenance;
  readonly position: PlanningPoint;
  readonly bounds?: PlanningBounds;
  readonly parentId?: string;
}

export interface LocationFilter {
  readonly spaceId?: string;
  readonly layer?: PlanningLayer;
  readonly use?: PlanningUse;
  readonly status?: PlanningStatus;
}

export interface NearbyLocation {
  readonly location: PlannedLocation;
  /** Distance in the supplied synthetic/project-owned coordinate space; never a travel time. */
  readonly distance: number;
}

const identifier = /^[a-z][a-z0-9_-]{1,63}$/;
const layers: readonly PlanningLayer[] = ['exterior', 'interior', 'underground'];
const uses: readonly PlanningUse[] = [
  'region',
  'business',
  'property',
  'public-service',
  'transport',
  'interaction',
];
const statuses: readonly PlanningStatus[] = ['draft', 'reviewed'];
const provenances: readonly PlanningProvenance[] = ['synthetic', 'project-owned'];

const validPoint = (value: PlanningPoint): void => {
  if (
    value === null ||
    typeof value !== 'object' ||
    !Number.isFinite(value.x) ||
    !Number.isFinite(value.y) ||
    !Number.isFinite(value.z)
  ) {
    throw new RangeError('Planning coordinates must be finite x/y/z numbers.');
  }
};

const frozenPoint = (value: PlanningPoint): PlanningPoint => {
  validPoint(value);
  return Object.freeze({ x: value.x, y: value.y, z: value.z });
};

const frozenBounds = (bounds: PlanningBounds): PlanningBounds => {
  if (bounds === null || typeof bounds !== 'object') {
    throw new RangeError('Planning bounds must be an object.');
  }
  const min = frozenPoint(bounds.min);
  const max = frozenPoint(bounds.max);
  if (min.x > max.x || min.y > max.y || min.z > max.z) {
    throw new RangeError('Planning bounds must have ordered minimum and maximum.');
  }
  return Object.freeze({ min, max });
};

const copyLocation = (value: PlannedLocation): PlannedLocation => {
  if (value === null || typeof value !== 'object') {
    throw new TypeError('A planned location must be an object.');
  }
  if (!identifier.test(value.id) || !identifier.test(value.spaceId)) {
    throw new RangeError('Planning IDs must be 2-64 lowercase letters, digits, _ or -.');
  }
  if (typeof value.label !== 'string' || value.label.trim().length === 0) {
    throw new RangeError('A planned location needs a nonempty label.');
  }
  if (
    !layers.includes(value.layer) ||
    !uses.includes(value.use) ||
    !statuses.includes(value.status) ||
    !provenances.includes(value.provenance)
  ) {
    throw new RangeError('Invalid planning layer, use, status or provenance.');
  }
  if (value.parentId !== undefined && !identifier.test(value.parentId)) {
    throw new RangeError('Invalid planning parent ID.');
  }
  return Object.freeze({
    id: value.id,
    spaceId: value.spaceId,
    label: value.label.trim(),
    layer: value.layer,
    use: value.use,
    status: value.status,
    provenance: value.provenance,
    position: frozenPoint(value.position),
    ...(value.bounds === undefined ? {} : { bounds: frozenBounds(value.bounds) }),
    ...(value.parentId === undefined ? {} : { parentId: value.parentId }),
  });
};

const matches = (location: PlannedLocation, filter: LocationFilter): boolean =>
  (filter.spaceId === undefined || location.spaceId === filter.spaceId) &&
  (filter.layer === undefined || location.layer === filter.layer) &&
  (filter.use === undefined || location.use === filter.use) &&
  (filter.status === undefined || location.status === filter.status);

const distanceBetween = (first: PlanningPoint, second: PlanningPoint): number =>
  Math.hypot(first.x - second.x, first.y - second.y, first.z - second.z);

/**
 * Read-only location index for RP planning and simulation.
 *
 * No archive parsing, spawn calls, routing, game asset references or authority
 * claims. The caller supplies independently created, approved planning data.
 */
export class WorldPlanningCatalog {
  readonly #locations = new Map<string, PlannedLocation>();

  public constructor(locations: readonly PlannedLocation[]) {
    for (const source of locations) {
      const location = copyLocation(source);
      if (this.#locations.has(location.id)) {
        throw new RangeError(`Duplicate planning location ID: ${location.id}`);
      }
      this.#locations.set(location.id, location);
    }

    for (const location of this.#locations.values()) {
      const visited = new Set<string>([location.id]);
      let parentId = location.parentId;
      while (parentId !== undefined) {
        if (visited.has(parentId)) {
          throw new RangeError(`Cyclic planning hierarchy at: ${location.id}`);
        }
        visited.add(parentId);
        const parent = this.#locations.get(parentId);
        if (parent === undefined) {
          throw new RangeError(`Unknown planning parent for: ${location.id}`);
        }
        parentId = parent.parentId;
      }
    }
  }

  public get(id: string): PlannedLocation | undefined {
    return this.#locations.get(id);
  }

  public list(filter: LocationFilter = {}): readonly PlannedLocation[] {
    return [...this.#locations.values()]
      .filter((location) => matches(location, filter))
      .sort((first, second) => first.id.localeCompare(second.id));
  }

  /** Bounds containment; a point-only location matches its exact anchor. */
  public at(
    spaceId: string,
    point: PlanningPoint,
    filter: LocationFilter = {},
  ): readonly PlannedLocation[] {
    validPoint(point);
    return this.list({ ...filter, spaceId }).filter((location) => {
      if (location.bounds === undefined) {
        return distanceBetween(location.position, point) === 0;
      }
      const { min, max } = location.bounds;
      return (
        point.x >= min.x &&
        point.x <= max.x &&
        point.y >= min.y &&
        point.y <= max.y &&
        point.z >= min.z &&
        point.z <= max.z
      );
    });
  }

  /** Anchor proximity in one declared space, not real navmesh routing. */
  public nearby(
    spaceId: string,
    point: PlanningPoint,
    radius: number,
    filter: LocationFilter = {},
  ): readonly NearbyLocation[] {
    validPoint(point);
    if (!Number.isFinite(radius) || radius < 0) {
      throw new RangeError('Planning search radius must be a finite nonnegative number.');
    }
    return this.list({ ...filter, spaceId })
      .map((location) =>
        Object.freeze({ location, distance: distanceBetween(location.position, point) }),
      )
      .filter((hit) => hit.distance <= radius)
      .sort(
        (first, second) =>
          first.distance - second.distance || first.location.id.localeCompare(second.location.id),
      );
  }
}
