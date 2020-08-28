import { startΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should filter tests by name', async () => {
    const { logs, paths, cleanup, runNames } = await createFixture('test-betterer-filter', {
      '.betterer.js': `
const { bigger } = require('@betterer/constraints');

module.exports = {
  'test 1': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 2': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 3': {
    test: () => Date.now(),
    constraint: bigger
  }
};
      `
    });

    const fixturePath = paths.fixture;

    const firstRun = await startΔ(fixturePath, ARGV);

    expect(runNames(firstRun.ran)).toEqual(['test 1', 'test 2', 'test 3']);

    const secondRun = await startΔ(fixturePath, [...ARGV, '--filter', '1']);

    expect(runNames(secondRun.ran)).toEqual(['test 1']);

    const thirdRun = await startΔ(fixturePath, [...ARGV, '--filter', '1', '--filter', '3']);

    expect(runNames(thirdRun.ran)).toEqual(['test 1', 'test 3']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
