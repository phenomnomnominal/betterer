import { describe, it, expect } from 'vitest';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported default test in a CJS module', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'upgrade-exported-default-test-cjs',
      {
        './.betterer.js': `
const { BettererTest, BettererFileTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  getsBetter: {
    test: () => start++,
    constraint: bigger
  },
  'gets better': new BettererTest({
    test: () => start++,
    constraint: bigger
  }),
  countFiles: new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }),
  'count files': new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }).include('./src/**/*.ts')
}
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    await cli__(fixturePath, [...ARGV, '--save']);

    const upgradedConfig = await readFile(paths.config);

    expect(upgradedConfig).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
