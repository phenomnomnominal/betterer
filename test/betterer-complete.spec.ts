import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

'../fixtures/test-betterer-complete';

describe('betterer', () => {
  it(`should work when a test meets its goal`, async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-complete', {
      '.betterer.js': `
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets completed': {
    test: () => start++,
    constraint: bigger,
    goal: (result) => result >= 2
  },
  'already completed': {
    test: () => 0,
    constraint: bigger,
    goal: 0
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.new)).toEqual(['gets completed', 'already completed']);
    expect(runNames(firstRun.completed)).toEqual(['already completed']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(runNames(secondRun.better)).toEqual(['gets completed']);

    const thirdRun = await betterer({ configPaths, resultsPath });

    expect(runNames(thirdRun.completed)).toEqual(['gets completed', 'already completed']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
