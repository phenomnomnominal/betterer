import { defineConfig } from 'vitest/config';

import { MCROptions } from './config/mcr.config.js';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths({
      configNames: ['config/tsconfig.spec.json']
    }),
    {
      // The engine defaults to a built-in plain-text reporter; assert on the rich
      // `@betterer/reporter` output (what CLI users see) in the e2e snapshots.
      name: 'betterer-test-default-reporter',
      enforce: 'pre',
      resolveId(source: string): string | null {
        return source.endsWith('default-reporter.js') ? resolve(dir, 'test/default-reporter.ts') : null;
      }
    }
  ],
  server: {
    watch: {
      ignored: ['**/fixtures/**']
    }
  },
  test: {
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.e2e.spec.ts'],
    reporters: ['basic'],
    isolate: true,

    fileParallelism: true,

    // Our tests are basically E2E so they're a bit slow as is...
    slowTestThreshold: 30000,
    testTimeout: 90000,

    watch: false,
    coverage: {
      enabled: true,
      reportsDirectory: 'reports/unit-coverage-v8',

      provider: 'custom',
      customProviderModule: 'vitest-monocart-coverage',

      // @ts-expect-error - types are wrong for monocart I guess?
      coverageReportOptions: MCROptions
    }
  }
});
