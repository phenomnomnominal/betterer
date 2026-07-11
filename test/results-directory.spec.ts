import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should track a result getting worse and then better with the directory strategy', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const resultsDir = `${resultsPath}.d`;
    const indexPath = resolve('./src/index.ts');

    process.env.BETTERER_WORKER = 'false';

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newTestRun.new)).toEqual(['regexp']);

    const sameTestRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameTestRun.same)).toEqual(['regexp']);

    await writeFile(indexPath, `// HACK:\n// HACK:`);
    const worseTestRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(worseTestRun.worse)).toEqual(['regexp']);

    await writeFile(indexPath, ``);
    const betterTestRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(betterTestRun.better)).toEqual(['regexp']);

    const completedTestRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(completedTestRun.completed)).toEqual(['regexp']);

    await cleanup();
  });
});
