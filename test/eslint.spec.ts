import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should report the status of a new eslint rule', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup, resolve, writeFile, testNames } = await createFixture('eslint', {
      '.betterer.js': `
import { eslint } from '@betterer/eslint';

export default {
  test: () => eslint({ 
      rules: { 
        'no-debugger': 'error'
      }
    })
    .include('./src/**/*.ts')
};      
      `,
      'eslint.config.js': `
import config from '../../eslint.config.js';

export default [
  ...config,
  {
    ignores: ['!fixtures/**']
  },
  { rules: { 'no-debugger': 'off' } }
];
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
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(sameTestRun.same)).toEqual(['test']);

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(worseTestRun.worse)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, '');

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(betterTestRun.better)).toEqual(['test']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(completedTestRun.completed)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
