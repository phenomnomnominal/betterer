import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should let you override the goal of a file test', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, logs, cleanup, resolve, testNames, readFile, writeFile } = await createFixture('file-test-goal', {
      '.betterer.js': `
import { eslint } from '@betterer/eslint';

export default {
  test: () => eslint({ 
      rules: { 
        'no-debugger': 'error'
      }
    })
    .include('./src/**/*.ts')
    .goal((result) => result.getIssues().length === 1)
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
  "extends": "../../tsconfig.spec.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(sameTestRun.same)).toEqual(['test']);

    await writeFile(indexPath, `debugger;\ndebugger;\ndebugger;`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(worseTestRun.worse)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, 'debugger;');

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(betterTestRun.better)).toEqual(['test']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(completedTestRun.completed)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
