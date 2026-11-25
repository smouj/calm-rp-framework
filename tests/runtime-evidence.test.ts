import { describe, expect, it } from 'vitest';
import {
  GTA6_MINIMUM_RUNTIME_REQUIREMENTS,
  GTA6_UNVERIFIED_CAPABILITIES,
  inspectGta6RuntimeEvidence,
} from '@gta6-rp/contracts';
import type { Gta6RuntimeEvidence } from '@gta6-rp/contracts';

describe('GTA VI evidence boundary (research only)', () => {
  it('starts blocked: no approved GTA VI multiplayer evidence or callable capabilities', () => {
    const report = inspectGta6RuntimeEvidence([]);
    expect(report.eligibleForHumanReview).toBe(false);
    expect(report.withoutFirstPartyContract).toEqual([...GTA6_MINIMUM_RUNTIME_REQUIREMENTS]);
    expect(report.withoutConformanceTest).toEqual([...GTA6_MINIMUM_RUNTIME_REQUIREMENTS]);
    expect(GTA6_UNVERIFIED_CAPABILITIES).toEqual([]);
  });

  it('does not mistake offline executable compatibility for a community-server API', () => {
    const evidence: Gta6RuntimeEvidence[] = GTA6_MINIMUM_RUNTIME_REQUIREMENTS.map(
      (requirement) => ({
        requirement,
        origin: 'third-party-execution',
        sourceUrl: 'https://github.com/ProjectLeonidaL/leonida',
        reviewedForGta6: true,
        conformanceTestId: 'synthetic-only',
      }),
    );
    expect(inspectGta6RuntimeEvidence(evidence).eligibleForHumanReview).toBe(false);
    expect(inspectGta6RuntimeEvidence(evidence).withoutFirstPartyContract).toHaveLength(6);
  });

  it('does not accept a gameplay observation or a simulator for a server contract', () => {
    const evidence: Gta6RuntimeEvidence[] = [
      {
        requirement: 'RT-003',
        origin: 'observed-gameplay',
        sourceUrl: 'https://www.rockstargames.com/VI',
        reviewedForGta6: true,
      },
      {
        requirement: 'RT-005',
        origin: 'synthetic-simulator',
        sourceUrl: 'https://github.com/smouj/calm-rp-framework',
        reviewedForGta6: true,
      },
    ];
    expect(inspectGta6RuntimeEvidence(evidence).withoutFirstPartyContract).toContain('RT-003');
    expect(inspectGta6RuntimeEvidence(evidence).withoutFirstPartyContract).toContain('RT-005');
  });

  it('requires test evidence and human review separately from a documented contract', () => {
    const evidence: Gta6RuntimeEvidence[] = [
      {
        requirement: 'RT-001',
        origin: 'first-party-gta6-runtime',
        sourceUrl: 'https://example.invalid/specification',
        reviewedForGta6: true,
      },
    ];
    const report = inspectGta6RuntimeEvidence(evidence);
    expect(report.withoutFirstPartyContract).not.toContain('RT-001');
    expect(report.withoutConformanceTest).toContain('RT-001');
    expect(report.eligibleForHumanReview).toBe(false);
  });

  it('never changes runtime capability declarations even for a structurally complete fixture', () => {
    const fabricated: Gta6RuntimeEvidence[] = GTA6_MINIMUM_RUNTIME_REQUIREMENTS.map(
      (requirement) => ({
        requirement,
        origin: 'first-party-gta6-runtime',
        sourceUrl: 'https://example.invalid/fictional-spec',
        reviewedForGta6: true,
        conformanceTestId: 'fixture-0001',
      }),
    );
    expect(inspectGta6RuntimeEvidence(fabricated).eligibleForHumanReview).toBe(true);
    expect(GTA6_UNVERIFIED_CAPABILITIES).toHaveLength(0);
    // eligibleForHumanReview is not validation, consent or GTA VI compatibility.
  });
});
