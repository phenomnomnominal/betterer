import { createFixture } from './fixture';
import { betterer } from '@betterer/betterer';
import { BettererCoverageIssues } from '@betterer/coverage';

describe('betterer', () => {
  let totalResult: {
    lines: { total: number; covered: number; skipped: number; pct: number };
    statements: { total: number; covered: number; skipped: number; pct: number };
    functions: { total: number; covered: number; skipped: number; pct: number };
    branches: { total: number; covered: number; skipped: number; pct: number };
    branchesTrue: { total: number; covered: number; skipped: number; pct: number };
  };

  beforeEach(() => {
    totalResult = {
      lines: { total: 4931, covered: 227, skipped: 0, pct: 4.6 },
      statements: { total: 5185, covered: 236, skipped: 0, pct: 4.55 },
      functions: { total: 1340, covered: 31, skipped: 0, pct: 2.31 },
      branches: { total: 3025, covered: 83, skipped: 0, pct: 2.74 },
      branchesTrue: { total: 0, covered: 0, skipped: 0, pct: 100 }
    };
  });

  it('should report the total coverage', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, testNames } = await createFixture('coverage', {
      '.betterer.js': `
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage({ totalCoverage: true, baseDir: __dirname })
};      
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js"]
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const coveragePath = resolve('./coverage/coverage-summary.json');
    await writeFile(
      coveragePath,
      JSON.stringify({
        total: totalResult
      })
    );

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(sameTestRun.same)).toEqual(['test']);

    const testResult = sameTestRun.same[0].result?.value as BettererCoverageIssues;
    expect(testResult.total).toEqual({
      lines: 4931 - 227,
      statements: 5185 - 236,
      functions: 1340 - 31,
      branches: 3025 - 83
    });

    totalResult.lines.covered += 100;

    await writeFile(
      coveragePath,
      JSON.stringify({
        total: totalResult
      })
    );

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(betterTestRun.better)).toEqual(['test']);

    totalResult.branches.covered -= 10;

    await writeFile(
      coveragePath,
      JSON.stringify({
        total: totalResult
      })
    );

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(worseTestRun.worse)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
