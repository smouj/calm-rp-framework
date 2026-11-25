import { defineConfig } from 'vitest/config';

// The embedded-PostgreSQL suites boot a real PostgreSQL cluster per run. On
// hosted runners, single tests have intermittently exceeded Vitest's default
// 5,000 ms ceiling (issue #51; e.g. CI run 45527778435: the ledger
// deduplication race finished in 5,048 ms and failed only on the timeout,
// not on an assertion). Raising the ceiling keeps failures loud while
// removing the flake: a genuinely broken test still fails here, just later.
// Local runs were never close to the old limit; 20 s leaves ample headroom
// for cluster startup plus concurrency races on a shared, cold runner.
export default defineConfig({
  test: {
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
