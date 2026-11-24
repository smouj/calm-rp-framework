import type { AccountId, RequestId } from '@gta6-rp/core';

/**
 * Independent project contracts. These are NOT GTA VI native functions,
 * observed function signatures, or a working game integration.
 */
export const PORTABLE_CAPABILITIES = [
  'session.resolve',
  'intent.receive',
  'projection.send',
  'entity.reference',
  'location.query',
  'world.interact',
  'resource.lifecycle',
] as const;

export type PortableCapability = (typeof PORTABLE_CAPABILITIES)[number];
export type RuntimeTarget = 'simulator' | 'authorized-adapter';

/**
 * A session's account identity must come from a trusted server-side resolver.
 * Never accept this identity as a field in untrusted client commands.
 */
export interface ResolvedSession {
  readonly sessionId: string;
  readonly accountId: AccountId;
}

export interface ClientIntent {
  readonly requestId: RequestId;
  readonly sessionId: string;
  readonly commandType: string;
  readonly payload: unknown;
}

export interface ServerProjection {
  readonly type: string;
  readonly payload: unknown;
}

export interface PortableRuntimePort {
  readonly target: RuntimeTarget;
  readonly supportedCapabilities: readonly PortableCapability[];
  resolveSession(sessionId: string): Promise<ResolvedSession | null>;
  sendProjection(sessionId: string, projection: ServerProjection): Promise<void>;
}

export class UnsupportedRuntimeCapabilityError extends Error {
  public constructor(public readonly missing: readonly PortableCapability[]) {
    super('Runtime adapter is missing required capabilities: ' + missing.join(', '));
    this.name = 'UnsupportedRuntimeCapabilityError';
  }
}

/** Fail closed when an adapter does not explicitly declare a required capability. */
export function requireRuntimeCapabilities(
  available: readonly PortableCapability[],
  required: readonly PortableCapability[],
): void {
  const valid = new Set<PortableCapability>(PORTABLE_CAPABILITIES);
  if (available.some((item) => !valid.has(item))) {
    throw new Error('Adapter declares an unknown runtime capability.');
  }
  const present = new Set(available);
  const missing = [...new Set(required.filter((item) => !present.has(item)))];
  if (missing.length > 0) throw new UnsupportedRuntimeCapabilityError(missing);
}

/**
 * No legitimate GTA VI adapter contract is confirmed. An empty capability
 * set prevents callers from mistaking public format research for runtime support.
 */
export const GTA6_UNVERIFIED_CAPABILITIES: readonly PortableCapability[] = Object.freeze([]);
