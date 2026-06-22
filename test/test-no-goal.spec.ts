import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should run a test that has no goal', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup, testNames } = await createFixture('test-no-goal', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';

export default {
  test: () => new BettererTest({
    test: () => 1,
    constraint: smaller
  })
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const suite = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(suite.new)).toEqual(['test']);
    expect(testNames(suite.completed)).toEqual([]);
    expect(testNames(suite.failed)).toEqual([]);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
