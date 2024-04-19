import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should fail when the coverage report is missing', async () => {
    const { betterer } = await import('@betterer/betterer');

    const fixture = await createFixture('coverage-report-missing', {
      '.betterer.js': `
import { coverageTotal } from '@betterer/coverage';

export default {
  test: () => coverageTotal()
};    
        `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js"]
}
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
