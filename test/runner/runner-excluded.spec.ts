import { describe, expect, it } from 'vitest';

import { createFixture } from '../fixture.js';

describe('betterer.runner', () => {
  it(`should ignore any files that aren't included in the test`, async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, resolve, cleanup, writeFile } = await createFixture('runner-excluded', {
      '.betterer.js': `
import { eslint } from '@betterer/eslint';

export default {
  test: () => eslint({ 'no-debugger': 'error'}).include('./src/**/*.ts')
};    
      `,
      '.eslintrc.cjs': `
const path = require('node:path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-debugger': 1
  }
};
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const testPath = resolve('./test/index.ts');

    await writeFile(testPath, `debugger;`);

    const runner = await betterer.runner({ configPaths, resultsPath, cwd, workers: false });
    await runner.queue(testPath);
    const suiteSummary = await runner.stop();
    const [runSummary] = suiteSummary.runSummaries;

    expect(runSummary.isComplete).toEqual(true);
    expect(runSummary.filePaths).toHaveLength(0);

    await cleanup();
  });
});
