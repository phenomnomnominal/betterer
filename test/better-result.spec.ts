import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a result gets better', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture(
      'better-result',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller, bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);
const shrinks = persist(__dirname, 'shrinks', 2);

module.exports = {
  'should shrink': () => new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.increment(),
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
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(firstRun.new)).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(secondRun.better)).toEqual(['should shrink', 'should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
