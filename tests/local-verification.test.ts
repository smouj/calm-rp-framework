import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('local-first verification', () => {
  it('ships a verification gate that does not require a hosted runner', () => {
    const gate = read('scripts/verify-local.sh');

    expect(gate).toContain('verify');
    // The gate must run the same checks as hosted CI.
    for (const stage of ['lint', 'typecheck', 'test', 'format:check', 'build']) {
      expect(gate).toContain(`pnpm ${stage}`);
    }
    // And must not itself depend on GitHub Actions.
    expect(gate).not.toContain('gh workflow run');
    expect(gate).not.toContain('github.com/');
  });

  it('exposes the gate through package scripts', () => {
    const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> };

    expect(pkg.scripts.verify).toContain('verify-local.sh');
    expect(pkg.scripts['check:artifacts']).toContain('check-no-proprietary-artifacts.sh');
    expect(pkg.scripts['check:secrets']).toContain('check-no-secrets.sh');
    expect(pkg.scripts['check:site']).toContain('check-site-integrity.sh');
  });

  it('runs the offline hygiene checks before anything requiring node_modules', () => {
    const gate = read('scripts/verify-local.sh');
    const artifacts = gate.indexOf('check-no-proprietary-artifacts.sh');
    const lint = gate.indexOf('pnpm lint');

    expect(artifacts).toBeGreaterThan(-1);
    expect(artifacts).toBeLessThan(lint);
  });

  it('does not fail the Pages workflow when Pages is unavailable', () => {
    const pages = read('.github/workflows/pages.yml');

    expect(pages).toContain('Detect whether Pages is enabled');
    expect(pages).toContain("enabled == 'true'");
  });

  it('declares resolvable entry points for every workspace package', () => {
    for (const dir of ['packages/core', 'packages/contracts', 'adapters/simulator']) {
      const manifest = JSON.parse(read(`${dir}/package.json`)) as {
        exports?: Record<string, unknown>;
        types?: string;
      };

      expect(manifest.exports, `${dir} must declare exports`).toBeTruthy();
      expect(manifest.types, `${dir} must declare types`).toBeTruthy();
    }
  });
});
