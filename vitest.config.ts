import { defineConfig } from 'vitest/config';

// The embedded-PostgreSQL suites boot a real PostgreSQL cluster per run. On
// hosted runners, single tests have intermittently exceeded Vitest's default
// 5,000 ms ceiling (issue #51; e.g. CI run 45527778435: the ledger
// deduplication race finished in 5,048 ms and failed only on the timeout,
// not on an assertion). Raising the ceiling keeps failures loud while
// removing the flake: a genuinely broken test still fails here, just later.
// Each PostgreSQL-backed suite opens its own embedded cluster. Limit parallel
// files so those independent databases do not oversubscribe memory and disk
// on developer machines or hosted runners; concurrency remains exercised
// within the dedicated race tests.
export default defineConfig({
  test: {
    testTimeout: 20_000,
    hookTimeout: 20_000,
    maxWorkers: 2,
  },
});
