import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should let you override the constraint of a file test', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, logs, cleanup, resolve, testNames, readFile, writeFile } = await createFixture(
      'file-test-constraint',
      {
        '.betterer.js': `
import { eslint } from '@betterer/eslint';
import { BettererConstraintResult } from '@betterer/constraints';

export default {
  test: () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts').constraint(() => BettererConstraintResult.same)
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
    `,
        './src/index.ts': ''
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    await writeFile(indexPath, `debugger;\ndebugger;\ndebugger;`);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(sameTestRun.same)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();
    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
