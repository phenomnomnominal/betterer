import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should do nothing when a test is not past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-deadline-in-future', {
      '.betterer.js': `
const { bigger } = require('@betterer/constraints');

let grows = 0;

module.exports = {
  'should grow': {
    test: () => grows++,
    constraint: bigger,
    goal: 5,
    deadline: new Date()
  }
};
      `
    });

    jest.spyOn(Date, 'now').mockImplementation(() => 1589714460851);

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.expired)).toEqual([]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should mark a test as expired when it is past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-deadline-in-past', {
      '.betterer.js': `
const { bigger } = require('@betterer/constraints');

let grows = 0;

module.exports = {
  'should grow': {
    test: () => grows++,
    constraint: bigger,
    goal: 5,
    deadline: 0
  }
};
      `
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date().getTime();
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.expired)).toEqual(['should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
