import { describe, expect, it } from 'vitest';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should keep an empty file test present in the results directory', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory-empty', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), ``);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.completed)).toEqual(['regexp']);

    const markerStat = await fs.stat(path.join(resultsDir, 'regexp', '.empty'));
    expect(markerStat.isFile()).toBe(true);

    const completedRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(completedRun.completed)).toEqual(['regexp']);
    expect(testNames(completedRun.new)).toEqual([]);

    await cleanup();
  });
});
