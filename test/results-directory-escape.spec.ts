import { describe, expect, it } from 'vitest';

import { existsSync } from 'node:fs';
import path from 'node:path';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should safely store a test name that would otherwise escape the results directory', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory-escape', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  '..': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['..']);
    expect(existsSync(path.join(resultsDir, '%2E%2E'))).toBe(true);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['..']);

    await cleanup();
  });
});
