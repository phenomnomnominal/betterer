import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the status of a new eslint rule with a complex set up', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-eslint-complex',
      {
        '.betterer.ts': `
import { eslint } from '@betterer/eslint';

export default {
  'eslint enable no-debugger rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
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
  "include": ["./src/**/*", ".betterer.ts", "./.eslintrc.js"]
}
      `,
        'src/index.ts': `
debugger;
      `,
        'src/directory/.eslintrc.js': `
module.exports = {
  rules: {
    '@typescript-eslint/prefer-string-starts-ends-with': 'error'
  }
};
      `,
        'src/directory/index.ts': `
'hello'[0] === 'h';

export enum Numbers {
  one,
  two,
  three,
  four
}
      `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['eslint enable no-debugger rule']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['eslint enable no-debugger rule']);

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(worseTestRun.worse)).toEqual(['eslint enable no-debugger rule']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(betterTestRun.better)).toEqual(['eslint enable no-debugger rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(completedTestRun.completed)).toEqual(['eslint enable no-debugger rule']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
