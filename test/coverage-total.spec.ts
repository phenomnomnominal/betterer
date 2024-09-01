import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should report the total coverage', async () => {
    const { betterer } = await import('@betterer/betterer');

    const fixture = await createFixture('coverage-total', {
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

    const coverage = `{  
  "total": {
    "lines": { "total": 220, "covered": 110, "skipped": 0, "pct": 50 },
    "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
    "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 },
    "branches": { "total": 300, "covered": 100, "skipped": 0, "pct": 33.3 }
  }
}`;

    const configPaths = [fixture.paths.config];
    const resultsPath = fixture.paths.results;
    const coveragePath = fixture.resolve('./coverage/coverage-summary.json');

    await fixture.writeFile(coveragePath, coverage);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(newTestRun.new)).toEqual(['test']);

    const result = await fixture.readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

    const betterCoverage = `{  
      "total": {
        "lines": { "total": 220, "covered": 210, "skipped": 0, "pct": 95.4 },
        "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
        "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 },
        "branches": { "total": 300, "covered": 100, "skipped": 0, "pct": 33.3 }
      }
    }`;

    await fixture.writeFile(coveragePath, betterCoverage);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(betterTestRun.better)).toEqual(['test']);

    const worseCoverage = `{  
      "total": {
        "lines": { "total": 220, "covered": 210, "skipped": 0, "pct": 95.4 },
        "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
        "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 },
        "branches": { "total": 300, "covered":90, "skipped": 0, "pct": 30 }
      }
    }`;

    await fixture.writeFile(coveragePath, worseCoverage);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();

    await fixture.cleanup();
  });
});
