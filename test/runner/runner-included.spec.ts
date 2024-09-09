import { describe, expect, it } from 'vitest';

import { createFixture } from '../fixture.js';

describe('betterer.runner', () => {
  it('should run the test against an included file', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, resolve, cleanup, writeFile } = await createFixture('runner-included', {
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
  "extends": "../../tsconfig.spec.json",
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
    const [runSummary] = suiteSummary.runSummaries;

    expect(runSummary.isNew).toEqual(true);
    expect(runSummary.filePaths).toEqual([indexPath]);

    await cleanup();
  });
});
