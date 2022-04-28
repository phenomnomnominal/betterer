import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should fail when the coverage report is invalid', async () => {
    const fixture = await createFixture('coverage-report-invalid', {
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

    const coverage = `{  
  "total": {
    "lines": { "total": 220, "covered": 110, "skipped": 0, "pct": 50 },
    "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
    "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 }
  }
}`;

    const configPaths = [fixture.paths.config];
    const resultsPath = fixture.paths.results;
    const coveragePath = fixture.resolve('./coverage/coverage-summary.json');

    await fixture.writeFile(coveragePath, coverage);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(newTestRun.failed)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();

    await fixture.cleanup();
  });
});
