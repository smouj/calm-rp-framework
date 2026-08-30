import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string): string =>
  readFileSync(resolve(process.cwd(), path), 'utf8');

describe('architecture guardrails', () => {
  it('keeps the GTA VI adapter explicitly reserved', () => {
    expect(read('adapters/gta6/README.md')).toContain(
      'No GTA VI runtime integration is implemented',
    );
  });

  it('documents server authority as a core rule', () => {
    expect(read('ARCHITECTURE.md')).toContain('The game client is untrusted');
  });

  it('forbids adapter dependencies from domain packages', () => {
    expect(read('docs/architecture/BOUNDARIES.md')).toContain('packages -> adapters');
  });
});
