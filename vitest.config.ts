import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.e2e.spec.ts', 'test/workers.spec.ts'],
    hookTimeout: 2000000,
    testTimeout: 9000000,
    setupFiles: ['./test/setup.ts'],
    watch: false,
    watchExclude: ['**/fixtures', '**/packages/[^/]+/src'],
    coverage: {
      enabled: true,
      all: true,
      reportsDirectory: './reports/coverage',
      reporter: ['clover', 'json', 'json-summary', 'lcov', 'text']
    },
    reporters: ['basic', 'hanging-process']
  }
});
