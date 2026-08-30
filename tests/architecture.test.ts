import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('architecture guardrails', () => {
  it('keeps the GTA VI adapter explicitly reserved', () => {
    const adapterReadme = read('adapters/gta6/README.md');

    expect(adapterReadme).toContain('No GTA VI runtime integration is implemented');
    expect(adapterReadme).toContain('docs/server/RUNTIME_REQUIREMENTS.md');
    expect(adapterReadme).toContain('docs/research/PLATFORM_STATUS.md');
  });

  it('documents server authority as a core rule', () => {
    const architecture = read('ARCHITECTURE.md');
    const threatModel = read('docs/security/THREAT_MODEL.md');

    expect(architecture).toContain('The game client is untrusted');
    expect(threatModel).toContain('Persistent RP state can only change through authorized server-side use cases');
  });

  it('forbids runtime and adapter dependencies from domain packages', () => {
    const boundaries = read('docs/architecture/BOUNDARIES.md');

    expect(boundaries).toContain('packages/* -> adapters/*');
    expect(boundaries).toContain('packages/* -> GTA/FiveM/Cfx natives');
    expect(boundaries).toContain('packages/* -> undocumented GTA VI APIs');
  });

  it('keeps GTA VI runtime requirements explicitly blocked until verified', () => {
    const requirements = read('docs/server/RUNTIME_REQUIREMENTS.md');
    const platformStatus = read('docs/research/PLATFORM_STATUS.md');

    expect(requirements).toContain('**State:** BLOCKED');
    expect(requirements).toContain('| RT-001 | Authorized community-server/runtime path | `UNKNOWN` |');
    expect(platformStatus).toContain('## Not publicly confirmed for GTA VI');
  });

  it('documents evidence governance for platform claims', () => {
    const protocol = read('docs/research/RESEARCH_PROTOCOL.md');

    expect(protocol).toContain('`CONFIRMED`');
    expect(protocol).toContain('`PUBLIC_OBSERVED`');
    expect(protocol).toContain('Rumors, leaks and reverse engineering');
  });
});
