import { describe, it, expect } from 'vitest';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should return the current results for a test', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup } = await createFixture('results', {
      '.betterer.mjs': `
import { BettererTest } from '@betterer/betterer';
import { smaller, bigger } from '@betterer/constraints';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export default {
  test: () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  })
}; 
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, workers: false, silent: true });

    const resultsSummary = await betterer.results({ configPaths, resultsPath });

    const testResultSummary = resultsSummary.resultSummaries.find((resultSummary) => resultSummary.name === 'test');

    const testResult = !testResultSummary?.isFileTest && testResultSummary?.details;

    expect(testResult).toBe('1\n');

    await cleanup();
  });
});
