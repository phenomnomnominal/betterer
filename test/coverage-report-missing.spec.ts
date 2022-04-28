import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should fail when the coverage report is missing', async () => {
    const fixture = await createFixture('coverage-report-missing', {
      '.betterer.js': `
const { coverageTotal } = require('@betterer/coverage');

module.exports = {
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
