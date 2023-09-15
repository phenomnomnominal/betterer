import { jest } from '@jest/globals';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

jest.resetModules();
jest.mock('@betterer/time', (): typeof import('@betterer/time') => {
  const time = jest.requireActual('@betterer/time') as typeof import('@betterer/time');

  return {
    ...time,
    getPreciseTime__: () => 0,
    getTime__: () => 1589714460851
  };
});

describe('betterer', () => {
  it('should do nothing when a test is not past its deadline', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup, testNames } = await createFixture('deadline-future', {
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

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(firstRun.expired)).toEqual([]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
