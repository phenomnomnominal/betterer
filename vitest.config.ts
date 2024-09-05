import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

const isNode16 = process.version.startsWith('v16');

export default defineConfig({
  plugins: [
    tsconfigPaths({
      configNames: ['tsconfig.spec.json']
    })
  ],
  test: {
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.e2e.spec.ts'],
    reporters: ['basic'],
    isolate: false,

    // node.js v16 struggled with all the parallelism...
    fileParallelism: !isNode16,

    // Our tests are basically E2E so they're a bit slow as is...
    slowTestThreshold: 30000,
    testTimeout: 90000,

    watch: false,
    watchExclude: ['**/fixtures/**'],
    coverage: {
      all: true,
      enabled: true,
      exclude: [
        '.betterer.ts',
        '.eslintrc.cjs',
        '.prettierrc.cjs',
        'commitlint.config.js',
        'vitest.e2e.config.ts',
        'fixtures/**',
        'packages/**/public.ts',
        'packages/**/types.ts',
        'packages/docgen/**',
        'packages/extension/**',
        'packages/fixture/**',
        'packages/render/**',
        'test/**',
        'tools/**',
        'types/**',
        'website/**'
      ],
      reportsDirectory: 'reports/coverage'
    }
  }
});
