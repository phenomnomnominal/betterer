import { describe, it, expect } from 'vitest';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported constant built-in tests in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-built-in-esm',
      {
        './.betterer.js': `
import { regexp } from '@betterer/regexp';

export const noHack = regexp(/HACK/i).include('**/*.ts');
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
