import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should report a stable per-file coverage result', async () => {
    const { betterer } = await import('@betterer/betterer');

    const fixture = await createFixture('coverage-files-same', {
      '.betterer.js': `
import { coverage } from '@betterer/coverage';

export default {
  test: () => coverage()
};    
        `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js"]
}
      `
    });

    const file1Path = fixture.resolve('./src/file-1.ts');
    const file2Path = fixture.resolve('./src/file-2.ts');
    const file3Path = fixture.resolve('./src/file-3.ts');

    const coverage = `{  
  "total": {
    "lines": { "total": 220, "covered": 110, "skipped": 0, "pct": 50 },
    "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
    "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 },
    "branches": { "total": 300, "covered": 100, "skipped": 0, "pct": 33.3 }
  },
  "${file1Path}": {
    "lines": { "total": 100, "covered": 50, "skipped": 0, "pct": 50 },
    "statements": { "total": 200, "covered": 70, "skipped": 0, "pct": 35 },
    "functions": { "total": 20, "covered": 5, "skipped": 0, "pct": 25 },
    "branches": { "total": 150, "covered": 50, "skipped": 0, "pct": 33.3 }
  },
  "${file2Path}": {
    "lines": { "total": 120, "covered": 60, "skipped": 0, "pct": 50 },
    "statements": { "total": 210, "covered": 70, "skipped": 0, "pct": 33.3 },
    "functions": { "total": 10, "covered": 6, "skipped": 0, "pct": 60 },
    "branches": { "total": 150, "covered": 50, "skipped": 0, "pct": 33.3 }
  }
}`;

    const configPaths = [fixture.paths.config];
    const resultsPath = fixture.paths.results;
    const coveragePath = fixture.resolve('./coverage/coverage-summary.json');

    await fixture.writeFile(coveragePath, coverage);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(newTestRun.new)).toEqual(['test']);

    await betterer({ configPaths, resultsPath, workers: false });
    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

    const result = await fixture.readFile(resultsPath);
    expect(result).toMatchSnapshot();

    // file-3 is added but it is 100% covered
    const stillSameCoverage = `{  
      "total": {
        "lines": { "total": 220, "covered": 110, "skipped": 0, "pct": 50 },
        "statements": { "total": 410, "covered": 140, "skipped": 0, "pct": 34.1 },
        "functions": { "total": 30, "covered": 11, "skipped": 0, "pct": 36.6 },
        "branches": { "total": 300, "covered": 100, "skipped": 0, "pct": 33.3 }
      },
      "${file1Path}": {
        "lines": { "total": 100, "covered": 50, "skipped": 0, "pct": 50 },
        "statements": { "total": 200, "covered": 70, "skipped": 0, "pct": 35 },
        "functions": { "total": 20, "covered": 5, "skipped": 0, "pct": 25 },
        "branches": { "total": 150, "covered": 50, "skipped": 0, "pct": 33.3 }
      },
      "${file2Path}": {
        "lines": { "total": 120, "covered": 60, "skipped": 0, "pct": 50 },
        "statements": { "total": 210, "covered": 70, "skipped": 0, "pct": 33.3 },
        "functions": { "total": 10, "covered": 6, "skipped": 0, "pct": 60 },
        "branches": { "total": 150, "covered": 50, "skipped": 0, "pct": 33.3 }
      },
      "${file3Path}": {
        "lines": { "total": 120, "covered": 120, "skipped": 0, "pct": 100 },
        "statements": { "total": 210, "covered": 210, "skipped": 0, "pct": 100 },
        "functions": { "total": 10, "covered": 10, "skipped": 0, "pct": 100 },
        "branches": { "total": 150, "covered": 150, "skipped": 0, "pct": 100 }
      }
    }`;

    await fixture.writeFile(coveragePath, stillSameCoverage);

    const stillSameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(stillSameTestRun.same)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();

    await fixture.cleanup();
  });
});
