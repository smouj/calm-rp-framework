/**
 * This is a STRUCTURAL RESEARCH CHECK, not an authorization or a GTA VI API.
 * Inputs must be curated by maintainers; strings and URLs are not verified here.
 * The adapter stays disabled until separate legal, security and technical review.
 */
export const GTA6_MINIMUM_RUNTIME_REQUIREMENTS = [
  'RT-001',
  'RT-003',
  'RT-005',
  'RT-006',
  'RT-007',
  'RT-010',
] as const;

export type Gta6MinimumRequirement = (typeof GTA6_MINIMUM_RUNTIME_REQUIREMENTS)[number];

export type Gta6EvidenceOrigin =
  | 'first-party-gta6-runtime'
  | 'third-party-execution'
  | 'observed-gameplay'
  | 'synthetic-simulator';

export interface Gta6RuntimeEvidence {
  readonly requirement: Gta6MinimumRequirement;
  readonly origin: Gta6EvidenceOrigin;
  readonly sourceUrl: string;
  readonly reviewedForGta6: boolean;
  /** Identifier of a conformance test against an authorized runtime. */
  readonly conformanceTestId?: string;
}

export interface Gta6EvidenceAssessment {
  readonly withoutFirstPartyContract: readonly Gta6MinimumRequirement[];
  readonly withoutConformanceTest: readonly Gta6MinimumRequirement[];
  /** Evidence is structurally complete for human review, never automatic authorization. */
  readonly eligibleForHumanReview: boolean;
}

/**
 * Executing an Xbox title, translating shaders or emulating GDK services
 * never proves a programmable community-server contract.
 *
 * This helper validates only metadata supplied by a trusted maintainer.
 * It does not verify provenance, authenticity, licensing or runtime behavior.
 */
export function inspectGta6RuntimeEvidence(
  evidence: readonly Gta6RuntimeEvidence[],
): Gta6EvidenceAssessment {
  const withoutFirstPartyContract: Gta6MinimumRequirement[] = [];
  const withoutConformanceTest: Gta6MinimumRequirement[] = [];

  for (const requirement of GTA6_MINIMUM_RUNTIME_REQUIREMENTS) {
    const candidates = evidence.filter(
      (entry) =>
        entry.requirement === requirement &&
        entry.origin === 'first-party-gta6-runtime' &&
        entry.reviewedForGta6 &&
        /^https:\/\//.test(entry.sourceUrl),
    );

    if (candidates.length === 0) {
      withoutFirstPartyContract.push(requirement);
      withoutConformanceTest.push(requirement);
    } else if (
      !candidates.some(
        (entry) =>
          typeof entry.conformanceTestId === 'string' &&
          entry.conformanceTestId.trim().length > 0,
      )
    ) {
      withoutConformanceTest.push(requirement);
    }
  }

  return {
    withoutFirstPartyContract: Object.freeze(withoutFirstPartyContract),
    withoutConformanceTest: Object.freeze(withoutConformanceTest),
    eligibleForHumanReview:
      withoutFirstPartyContract.length === 0 && withoutConformanceTest.length === 0,
  };
}
