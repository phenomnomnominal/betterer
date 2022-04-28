import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer --silent', () => {
  it('should be possible to unmute a subsequent run', async () => {
    const { logs, paths, cleanup } = await createFixture('silent-unmute', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const shrinks = persist(__dirname, 'shrinks', 2);

module.exports = {
  test: () => new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  })
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, silent: true, workers: false });

    expect(logs).toHaveLength(0);

    await betterer({ configPaths, resultsPath, workers: false });

    expect(logs).not.toHaveLength(0);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
