import { betterer } from '@betterer/betterer';

import { createFixture } from '../fixture';

describe('betterer.runner', () => {
  it('should run the test against an included file', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('runner-included', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  test: () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
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
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;`);

    const runner = await betterer.runner({ configPaths, resultsPath, cwd, workers: false });
    await runner.queue(indexPath);
    const suiteSummary = await runner.stop();
    const [run] = suiteSummary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([indexPath]);

    await cleanup();
  });
});
