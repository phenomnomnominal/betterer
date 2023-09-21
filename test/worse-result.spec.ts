import { describe, it, expect } from 'vitest';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets worse', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, logs, resolve, readFile, cleanup, testNames } = await createFixture(
      'worse-result',
      {
        '.betterer.mjs': `
import { BettererTest } from '@betterer/betterer';
import { smaller, bigger } from '@betterer/constraints';
import { persist } from '@betterer/fixture';

const shrinks = persist(__dirname, 'shrinks', 2);
const grows = persist(__dirname, 'grows', 0);

export default {
  'should shrink': () => new BettererTest({
    test: () => shrinks.increment(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.decrement(),
    constraint: bigger
  })
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const configPaths = [paths.config];
    const resultsPath = resolve(paths.results);

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(firstRun.new)).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(secondRun.worse)).toEqual(['should shrink', 'should grow']);

    const [worseSummary] = secondRun.worse;
    expect(worseSummary.diff).toBeDefined();

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
