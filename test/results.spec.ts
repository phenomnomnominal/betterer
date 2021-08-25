import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should return the current results for a test', async () => {
    const { paths, cleanup } = await createFixture('results', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller, bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  test: () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  })
}; 
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, workers: 1, silent: true });

    const resultsSummary = await betterer.results({ configPaths, resultsPath });

    const testResultSummary = resultsSummary.testResultSummaries.find(
      (testResultSummary) => testResultSummary.name === 'test'
    );

    const testResult = !testResultSummary?.isFileTest && testResultSummary?.summary;

    expect(testResult).toBe('1\n');

    await cleanup();
  });
});
