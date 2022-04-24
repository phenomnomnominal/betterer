import { replace } from 'testdouble';

import * as bettererUtils from '../packages/betterer/dist/utils.js';
import { createFixture } from './fixture';
import { setupTestdouble } from './setup-testdouble';

jest.resetModules();
setupTestdouble();
replace('../packages/betterer/dist/utils.js', {
  ...bettererUtils,
  getTime: () => 1589714460851
});

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should do nothing when a test is not past its deadline', async () => {
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
