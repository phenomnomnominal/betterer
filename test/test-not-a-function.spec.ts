// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw if a test is not a function', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, logs, cleanup } = await createFixture('test-not-a-function', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const shrinks = persist(__dirname, 'shrinks', 2);

module.exports = {
  test: new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  })
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath, workers: false })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
