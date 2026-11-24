import { describe, expect, it } from 'vitest';
import {
  GTA6_UNVERIFIED_CAPABILITIES,
  PORTABLE_CAPABILITIES,
  UnsupportedRuntimeCapabilityError,
  requireRuntimeCapabilities,
} from '@gta6-rp/contracts';
import type { PortableRuntimePort } from '@gta6-rp/contracts';

describe('portable runtime contracts (independent of GTA VI)', () => {
  it('requires capabilities for a simulator', () => {
    const simulator: PortableRuntimePort = {
      target: 'simulator',
      supportedCapabilities: ['session.resolve', 'projection.send'],
      async resolveSession() { return null; },
      async sendProjection() { return; },
    };
    expect(() => requireRuntimeCapabilities(
      simulator.supportedCapabilities, ['session.resolve', 'projection.send'],
    )).not.toThrow();
    expect(() => requireRuntimeCapabilities(
      simulator.supportedCapabilities, ['intent.receive'],
    )).toThrow(UnsupportedRuntimeCapabilityError);
  });

  it('does not imply any GTA VI runtime capability', () => {
    expect(GTA6_UNVERIFIED_CAPABILITIES).toHaveLength(0);
    expect(Object.isFrozen(GTA6_UNVERIFIED_CAPABILITIES)).toBe(true);
    for (const capability of PORTABLE_CAPABILITIES) {
      expect(() => requireRuntimeCapabilities(
        GTA6_UNVERIFIED_CAPABILITIES, [capability],
      )).toThrow(UnsupportedRuntimeCapabilityError);
    }
  });

  it('lists missing requirements once and does not silently pass', () => {
    try {
      requireRuntimeCapabilities(
        ['session.resolve'],
        ['location.query', 'location.query', 'projection.send'],
      );
      throw new Error('Expected explicit failure');
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedRuntimeCapabilityError);
      expect((error as UnsupportedRuntimeCapabilityError).missing).toEqual(
        ['location.query', 'projection.send'],
      );
    }
  });

  it('rejects an undeclared capability even if a caller casts it', () => {
    expect(() => requireRuntimeCapabilities(
      ['undocumented-gta6-api' as never],
      ['undocumented-gta6-api' as never],
    )).toThrow('Adapter declares an unknown runtime capability.');
  });
});
