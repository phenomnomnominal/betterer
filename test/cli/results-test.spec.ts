import { betterer } from '@betterer/betterer';
import { resultsΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer', 'init'];

describe('betterer cli', () => {
  it('should report the current results for a test', async () => {
    const { logs, paths, cleanup } = await createFixture('results-test', {
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
    const fixturePath = paths.cwd;

    await betterer({ configPaths, resultsPath, workers: 1, silent: true });

    await resultsΔ(fixturePath, [...ARGV]);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
