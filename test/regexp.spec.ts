import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the existence of RegExp matches', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture('regexp', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['regexp']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(sameTestRun.same)).toEqual(['regexp']);

    await writeFile(indexPath, `// HACK:\n// HACK:`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(worseTestRun.worse)).toEqual(['regexp']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(betterTestRun.better)).toEqual(['regexp']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(completedTestRun.completed)).toEqual(['regexp']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});