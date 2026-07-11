import { describe, expect, it } from 'vitest';

import path from 'node:path';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should ignore stray files and directories in the results directory', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, createDirectory, resolve, writeFile, testNames } = await createFixture(
      'results-directory-stray',
      {
        '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
      }
    );

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['regexp']);

    // Handle random files:
    await createDirectory(path.join(resultsDir, 'stray'));
    await writeFile(path.join(resultsDir, '.DS_Store'), '');
    await writeFile(path.join(resultsDir, 'stray', '.DS_Store'), 'not json');

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['regexp']);
    expect(testNames(sameRun.obsolete)).toEqual([]);

    await cleanup();
  });
});
