import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer --silent', () => {
  it('should mute all console output', async () => {
    const { logs, paths, cleanup } = await createFixture('silent-mute', {
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
    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
