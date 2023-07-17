// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should show the logo', async () => {
    const { logs, paths, cleanup } = await createFixture('logo-show', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

module.exports = {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
};
      `
    });

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'start'], false);

    await cli__(fixturePath, [...ARGV, 'start', '--logo'], false);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
