import { describe, it, expect } from 'vitest';

import { simpleGit } from 'simple-git';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should not update the changeset when a test fails', async () => {
    const { cli__ } = await import('@betterer/cli');

    const { paths, logs, cleanup } = await createFixture('precommit-worse', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';

export default {
  throws: () => {
    return new BettererTest({
      test: () => { throw new Error(); },
      constraint: smaller
    });
  }
};
      `
    });

    const fixturePath = paths.cwd;

    await expect(async () => {
      await cli__(fixturePath, [...ARGV, 'precommit', '--workers=false']);
    }).rejects.toThrow('Tests failed while running in precommit mode. ❌');

    expect(logs).toMatchSnapshot();

    const git = simpleGit();
    const status = await git.status([paths.results]);
    expect(status.staged).toEqual([]);

    await cleanup();
  });
});
