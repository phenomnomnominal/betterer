// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported constant objects in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-object-cjs',
      {
        './.betterer.ts': `
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports.getsBetter = {
  test: () => start++,
  constraint: bigger
};
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
