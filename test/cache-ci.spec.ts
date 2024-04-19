import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should not update the cache file in CI mode', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup, resolve, writeFile, testNames } = await createFixture('cache-ci', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
    `
    });

    const cachePath = paths.cache;
    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:\n// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath, cachePath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    const newCache = await readFile(cachePath);

    expect(newCache).toMatchSnapshot();

    await writeFile(indexPath, `// HACK:\n// HACK:\n// HACK:`);

    const ciTestRun = await betterer({ configPaths, resultsPath, cachePath, ci: true, workers: false });

    expect(testNames(ciTestRun.worse)).toEqual(['test']);

    const ciCache = await readFile(cachePath);

    expect(ciCache).toEqual(newCache);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
