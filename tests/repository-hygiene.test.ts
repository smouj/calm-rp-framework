import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

const rootPackage = JSON.parse(read('package.json')) as {
  packageManager?: string;
};

describe('repository hygiene', () => {
  it('pins the package manager and freezes the dependency graph', () => {
    const lockfile = read('pnpm-lock.yaml');

    expect(rootPackage.packageManager).toBe('pnpm@10.34.5');
    expect(lockfile).toContain("lockfileVersion: '9.0'");
    expect(lockfile).toContain('typescript:');
    expect(lockfile).toContain('version: 5.9.3');
  });

  it('keeps CI least-privilege and reproducible', () => {
    const workflow = read('.github/workflows/ci.yml');

    expect(workflow).toContain('contents: read');
    expect(workflow).not.toContain('contents: write');
    expect(workflow).toContain('pnpm install --frozen-lockfile');
    expect(workflow).toContain('pnpm check');
  });

  it('pins third-party GitHub Actions to reviewed revisions', () => {
    const workflow = read('.github/workflows/ci.yml');

    expect(workflow).toContain('actions/checkout@fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09');
    expect(workflow).toContain('actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444');
  });

  it('keeps routine dependency automation grouped and bounded', () => {
    const dependabot = read('.github/dependabot.yml');

    expect(dependabot).toContain('open-pull-requests-limit: 2');
    expect(dependabot).toContain('development-toolchain:');
    expect(dependabot).toContain('package-ecosystem: github-actions');
  });

  it('does not track proprietary game package formats', () => {
    const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })
      .split('\\0')
      .filter(Boolean);

    const forbiddenFiles = trackedFiles.filter((path) =>
      /(?:^|\\/)(?:[^/]+\\.(?:rpf|ttpf|awc|xvc|xex)|game_scarlett_master\\.exe)$/i.test(path),
    );

    expect(forbiddenFiles).toEqual([]);
  });

  it('documents third-party research and provenance gates', () => {
    const assessment = read('docs/research/LEONIDA_2026-11-23.md');
    const policy = read('docs/operations/THIRD_PARTY_ARTIFACT_POLICY.md');

    expect(assessment).toContain('**Decision:** RESEARCH ONLY');
    expect(assessment).toContain('**BLOCKED**');
    expect(policy).toContain('Git-tracked paths');
    expect(policy).toContain('Human review remains required');
  });

  it('keeps project-facing identity independent', () => {
    const identity = read('docs/branding/PROJECT_IDENTITY.md');

    expect(identity).toContain('independent technical project');
    expect(identity).toContain('use original logomarks');
    expect(identity).toContain('Do not add:');
  });
});
