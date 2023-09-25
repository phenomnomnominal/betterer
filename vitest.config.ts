import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.e2e.spec.ts', 'test/workers.spec.ts'],
    testTimeout: 9000000,
    setupFiles: ['./test/setup.ts'],
    watch: false,
    watchExclude: ['**/fixtures', '**/packages/[^/]+/src'],
    coverage: {
      enabled: true,
      all: true,
      include: ['**/packages/**/src/**/*.ts'],
      reportsDirectory: './reports/coverage',
      reporter: ['text', 'html', 'clover', 'json']
    },
    reporters: ['basic', 'hanging-process'],
    cache: false
  }
});
