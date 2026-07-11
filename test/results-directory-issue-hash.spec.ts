import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should store issues whose hash contains path separators, and duplicate hashes', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory-issue-hash', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';

export default {
  'custom': () => new BettererFileTest((files, fileTestResult) => {
    files.forEach((filePath) => {
      const file = fileTestResult.addFile(filePath, 'aaaaaaaa');
      file.addIssue(0, 1, 'issue', '../evil/hash');
      file.addIssue(3, 4, 'issue', '../evil/hash');
    });
  }).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), 'aaaaaaaa');

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['custom']);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['custom']);

    await cleanup();
  });
});
