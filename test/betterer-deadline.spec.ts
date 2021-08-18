import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should do nothing when a test is not past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-deadline-in-future', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  'should grow': () => new BettererTest({
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

  it('should mark a test as expired when it is past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-deadline-in-past', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  'should grow': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger,
    goal: 5,
    deadline: 0
  })
};
      `
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date().getTime();
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.expired)).toEqual(['should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should mark a file test as expired when it is past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture(
      'test-betterer-file-test-deadline-in-past',
      {
        '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts').deadline('0')
};
    `
      }
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date().getTime();
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.expired)).toEqual(['tsquery no raw console.log']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
