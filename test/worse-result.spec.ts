import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should work when a test gets worse', async () => {
    const { paths, logs, resolve, readFile, cleanup, testNames } = await createFixture(
      'worse-result',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller, bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const shrinks = persist(__dirname, 'shrinks', 2);
const grows = persist(__dirname, 'grows', 0);

module.exports = {
  'should shrink': () => new BettererTest({
    test: () => shrinks.increment(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.decrement(),
    constraint: bigger
  })
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const configPaths = [paths.config];
    const resultsPath = resolve(paths.results);

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(firstRun.new)).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(secondRun.worse)).toEqual(['should shrink', 'should grow']);

    const [worseSummary] = secondRun.worse;
    expect(worseSummary.diff).toBeDefined();

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
