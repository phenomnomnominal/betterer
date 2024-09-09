import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should sort files by their file path', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, logs, cleanup, resolve, testNames, readFile, writeFile } = await createFixture(
      'file-test-sort-all',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await writeFile(resolve('./src/d.ts'), `debugger;\ndebugger;`);
    await writeFile(resolve('./src/a.ts'), `debugger;\ndebugger;`);
    await writeFile(resolve('./src/b.ts'), `debugger;\ndebugger;`);
    await writeFile(resolve('./src/c.ts'), `debugger;\ndebugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.ran)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();
    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
