import { betterer } from '@betterer/betterer';
import { cli__ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

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

    await betterer({ configPaths, resultsPath, workers: false, silent: true });

    await cli__(fixturePath, [...ARGV, 'results']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
