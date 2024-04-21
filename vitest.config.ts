import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

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
    environment: 'jsdom',
    reporters: ['basic'],
    isolate: false,
    slowTestThreshold: 10000,
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
