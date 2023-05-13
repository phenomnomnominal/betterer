import simpleGit from 'simple-git';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should test just the specified files', async () => {
    const { paths, logs, cleanup, resolve, readFile, writeFile } = await createFixture('precommit-specific-file', {
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
      `,
      './src/existing-file-1.ts': `
debugger;
      `,
      './src/existing-file-2.ts': `
debugger;
      `
    });

    const fixturePath = paths.cwd;
    const resultsPath = paths.results;

    const newFilePath = resolve('./src/new-file.ts');

    await writeFile(newFilePath, 'debugger;');

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'start'], false);

    await cli__(fixturePath, [...ARGV, 'precommit', newFilePath], false);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const git = simpleGit();
    await git.init();
    const status = await git.status([paths.results]);
    const [stagedResultsPath] = status.staged;
    expect(stagedResultsPath).toMatchSnapshot();

    await git.reset([resultsPath]);

    await cleanup();
  });
});
