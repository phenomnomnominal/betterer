import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should let you override the constraint of a file test', async () => {
    const { paths, logs, cleanup, resolve, runNames, readFile, writeFile } = await createFixture(
      'file-test-constraint',
      {
        '.betterer.js': `
const { eslint } = require('@betterer/eslint');
const { BettererConstraintResult } = require('@betterer/constraints');

module.exports = {
  test: () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts').constraint(() => BettererConstraintResult.same)
};
      `,
        '.eslintrc.js': `
const path = require('path');

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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['test']);

    await writeFile(indexPath, `debugger;\ndebugger;\ndebugger;`);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(sameTestRun.same)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();
    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
