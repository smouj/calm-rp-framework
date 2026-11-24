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
    // Asserting an exact commit would break every legitimate dependency bump while
    // proving nothing about the security property. The property under test is that
    // every action reference is a full 40-character commit SHA, never a mutable tag.
    for (const workflowPath of ['.github/workflows/ci.yml', '.github/workflows/pages.yml']) {
      const workflow = read(workflowPath);
      const references = [...workflow.matchAll(/uses:\s*(\S+)/g)]
        .map((match) => match[1])
        .filter((value): value is string => Boolean(value));

      expect(references.length).toBeGreaterThan(0);
      for (const reference of references) {
        const separator = reference.lastIndexOf('@');
        const action = separator > 0 ? reference.slice(0, separator) : '';
        const revision = separator > 0 ? reference.slice(separator + 1) : '';
        expect(action, `${workflowPath} action ${reference} is missing a revision`).toBeTruthy();
        expect(
          revision,
          `${workflowPath} action ${reference} is not pinned to a commit SHA`,
        ).toMatch(/^[0-9a-f]{40}$/);
      }
    }
  });

  it('keeps routine dependency automation grouped and bounded', () => {
    const dependabot = read('.github/dependabot.yml');

    expect(dependabot).toContain('open-pull-requests-limit: 2');
    expect(dependabot).toContain('development-toolchain:');
    expect(dependabot).toContain('package-ecosystem: github-actions');
  });

  it('does not expose local development databases on public interfaces', () => {
    const compose = read('infrastructure/docker/compose.yml');

    expect(compose).toContain("'127.0.0.1:5432:5432'");
    expect(compose).toContain("'127.0.0.1:6379:6379'");
    expect(compose).not.toContain("'5432:5432'");
    expect(compose).not.toContain("'6379:6379'");
  });

  it('keeps project-facing identity independent', () => {
    const identity = read('docs/branding/PROJECT_IDENTITY.md');

    expect(identity).toContain('independent technical project');
    expect(identity).toContain('use original logomarks');
    expect(identity).toContain('Do not add:');
  });
});
