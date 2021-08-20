import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, cleanup, runNames } = await createFixture(
      'same-result',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

const start = 0;

module.exports = {
  test: () => new BettererTest({
    test: () => start,
    constraint: bigger
  }),
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['test']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(secondRun.same)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
