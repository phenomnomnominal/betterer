import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should keep results when a runner is stopped after a run', async () => {
    const { betterer, runner } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-runner-stop', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const bettererRunner = await runner({ configPaths, resultsPath, workers: false });
    await bettererRunner.queue([]);
    await bettererRunner.stop();

    const sameRun = await betterer({ configPaths, resultsPath, workers: false });
    expect(testNames(sameRun.same)).toEqual(['regexp']);

    await cleanup();
  });
});
