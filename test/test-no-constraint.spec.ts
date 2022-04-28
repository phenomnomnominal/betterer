import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should throw if there is no constraint', async () => {
    const { paths, logs, cleanup } = await createFixture('test-no-constraint', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');

module.exports = {
  test: () => new BettererTest({})
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath, workers: false })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
