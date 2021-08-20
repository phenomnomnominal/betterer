import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should do nothing when a test is not past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('deadline-future', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  test: () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger,
    goal: 5,
    deadline: new Date()
  })
};
      `
    });

    jest.spyOn(Date, 'now').mockImplementation(() => 1589714460851);

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.expired)).toEqual([]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
