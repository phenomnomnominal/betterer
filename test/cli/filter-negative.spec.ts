import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should filter tests by name with negation', async () => {
    const { logs, paths, cleanup } = await createFixture(
      'filter-negative',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

module.exports = {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 2': () => new BettererTest({
    test: () => 0,
    constraint: bigger
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

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'start'], false);

    await cli__(fixturePath, [...ARGV, 'start', '--filter', '!1'], false);

    await cli__(fixturePath, [...ARGV, 'start', '--filter', 'test', '--filter', '![2|3]'], false);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
