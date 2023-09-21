import { describe, it, expect } from 'vitest';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should fail when the coverage report is missing', async () => {
    const { betterer } = await import('@betterer/betterer');

    const fixture = await createFixture('coverage-report-missing', {
      '.betterer.mjs': `
import { coverageTotal } from '@betterer/coverage';

export default {
  test: () => coverageTotal()
};    
        `
    });

    const configPaths = [fixture.paths.config];
    const resultsPath = fixture.paths.results;

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(newTestRun.failed)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();

    await fixture.cleanup();
  });
});
