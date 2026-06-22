import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should disable workers when workers is 0', async () => {
    const { runner } = await import('@betterer/betterer');

    const { paths, cleanup } = await createFixture('workers-disable', { '.betterer.ts': `export default {};` });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const betterRunner = await runner({ configPaths, resultsPath, workers: 0 });

    expect(process.env.BETTERER_WORKER).toBe('false');

    await betterRunner.stop(true);
    await cleanup();
  });
});
