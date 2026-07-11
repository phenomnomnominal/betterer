import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should track a value test through a value.json file', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, testNames } = await createFixture('results-directory-value-test', {
      '.betterer.js': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';

export default {
  'value': () => new BettererTest({
    test: () => 1,
    constraint: smaller
  })
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['value']);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['value']);

    await cleanup();
  });
});
