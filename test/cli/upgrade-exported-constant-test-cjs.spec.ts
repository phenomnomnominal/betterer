import { describe, it, expect } from 'vitest';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported constant tests in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-test-cjs',
      {
        './.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports.getsBetter = new BettererTest({
  test: () => start++,
  constraint: bigger
});
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
