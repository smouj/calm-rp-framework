import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('tracked-file intellectual-property hygiene', () => {
  it('does not commit proprietary game archives or binaries', () => {
    const tracked = execFileSync('git', ['ls-files', '--cached', '-z'], {
      encoding: 'utf8',
    })
      .split('\u0000')
      .filter(Boolean);
    const banned =
      /(?:^|\/)(?:game_scarlett_master\.exe|[^/]+\.(?:rpf|rpf9|xvc|xvd|pkg|xci|nsp|xip|xex|iso|torrent))$/i;
    expect(tracked.filter((path) => banned.test(path))).toEqual([]);
  });

  it('keeps the GTA VI capability declaration empty pending official runtime evidence', () => {
    const contracts = readFileSync('packages/contracts/src/runtime-port.ts', 'utf8');
    expect(contracts).toContain('GTA6_UNVERIFIED_CAPABILITIES');
    expect(contracts).toContain('Object.freeze([])');
  });
});
