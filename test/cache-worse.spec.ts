import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it(`doesn't cache if a test gets worse`, async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture('cache-worse', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const cachePath = resolve('./.betterer.cache');

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath, cachePath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['test']);

    const newCache = await readFile(cachePath);

    expect(newCache).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, cachePath, workers: false });

    expect(runNames(sameTestRun.same)).toEqual(['test']);

    await writeFile(indexPath, `// HACK:\n// HACK:`);

    const worseTestRun = await betterer({ configPaths, resultsPath, cachePath, workers: false });

    expect(runNames(worseTestRun.worse)).toEqual(['test']);

    const worseCache = await readFile(cachePath);

    expect(worseCache).toEqual(newCache);

    const stillWorseTestRun = await betterer({ configPaths, resultsPath, cachePath, workers: false });

    expect(runNames(stillWorseTestRun.worse)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
