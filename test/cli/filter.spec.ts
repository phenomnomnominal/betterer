import { cli__ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should filter tests by name', async () => {
    const { logs, paths, cleanup } = await createFixture(
      'filter',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger, smaller } = require('@betterer/constraints');

module.exports = {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 2': () => new BettererTest({
    test: () => 0,
    constraint: smaller
  }),
  'test 3': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  })
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const fixturePath = paths.cwd;

    await cli__(fixturePath, [...ARGV, 'start'], false);

    await cli__(fixturePath, [...ARGV, 'start', '--filter', '1'], false);

    await cli__(fixturePath, [...ARGV, 'start', '--filter', '1', '--filter', '3'], false);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
