import { describe, expect, it } from 'vitest';

import { createFixture } from '../fixture.js';

describe('betterer.runner', () => {
  it('should throw when stopped before running any tests', async () => {
    const { runner } = await import('@betterer/betterer');

    const { logs, paths, cleanup } = await createFixture('runner-stop-before-run', {
      '.betterer.ts': `export default {};`
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const betterRunner = await runner({ configPaths, resultsPath, workers: false });

    await expect(async () => await betterRunner.stop()).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
