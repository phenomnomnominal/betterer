import { createFixture } from './fixture';
import { betterer } from '@betterer/betterer';
import { BettererCoverageIssues } from '@betterer/coverage';
import { Fixture } from '@betterer/fixture';

interface Coverage {
  lines: { total: number; covered: number; skipped: number; pct: number };
  statements: { total: number; covered: number; skipped: number; pct: number };
  functions: { total: number; covered: number; skipped: number; pct: number };
  branches: { total: number; covered: number; skipped: number; pct: number };
  branchesTrue?: { total: number; covered: number; skipped: number; pct: number };
}

describe('betterer', () => {
  describe('total coverage test', () => {
    let totalResult: Coverage;

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
      const { logs, paths, readFile, cleanup, resolve, writeFile, testNames } = await createFixture('coverage-total', {
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

  describe('per file coverage', () => {
    let fixture: Fixture;
    let configPaths: Array<string>;
    let resultsPath: string;

    const totalCoverage: Coverage = {
      lines: { total: 4931, covered: 227, skipped: 0, pct: 4.6 },
      statements: { total: 5185, covered: 236, skipped: 0, pct: 4.55 },
      functions: { total: 1340, covered: 31, skipped: 0, pct: 2.31 },
      branches: { total: 3025, covered: 83, skipped: 0, pct: 2.74 },
      branchesTrue: { total: 0, covered: 0, skipped: 0, pct: 100 }
    };

    const fileCoverage: Record<string, Coverage> = {
      'src/file1.ts': {
        lines: { total: 100, covered: 50, skipped: 0, pct: 50 },
        statements: { total: 200, covered: 70, skipped: 0, pct: 35 },
        functions: { total: 20, covered: 5, skipped: 0, pct: 25 },
        branches: { total: 150, covered: 50, skipped: 0, pct: 33.3 }
      },
      'src/file2.ts': {
        lines: { total: 120, covered: 60, skipped: 0, pct: 50 },
        statements: { total: 210, covered: 70, skipped: 0, pct: 33.3 },
        functions: { total: 10, covered: 6, skipped: 0, pct: 60 },
        branches: { total: 150, covered: 50, skipped: 0, pct: 33.3 }
      }
    };

    const writeCoverage = async (files: Record<string, Coverage> = fileCoverage, total: Coverage = totalCoverage) => {
      const coverage: Record<string, Coverage> = {
        total
      };
      Object.keys(files).forEach((filePath) => {
        const resolved = fixture.resolve(filePath);
        coverage[resolved] = files[filePath];
      });

      const coveragePath = fixture.resolve('./coverage/coverage-summary.json');
      await fixture.writeFile(coveragePath, JSON.stringify(coverage));
    };

    beforeEach(async () => {
      fixture = await createFixture('coverage-files', {
        '.betterer.js': `
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage({ baseDir: __dirname })
};      
      `,
        'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js"]
}
      `
      });

      configPaths = [fixture.paths.config];
      resultsPath = fixture.paths.results;

      await writeCoverage();

      await betterer({ configPaths, resultsPath, workers: false });
    });

    afterEach(async () => {
      await fixture.cleanup();
    });

    it('should report a stable result', async () => {
      let sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

      const result = await fixture.readFile(resultsPath);
      expect(result).toMatchSnapshot();

      /* there is a new file but it is 100% covered */
      await writeCoverage({
        ...fileCoverage,
        'src/file3.ts': {
          lines: { total: 120, covered: 120, skipped: 0, pct: 100 },
          statements: { total: 210, covered: 210, skipped: 0, pct: 100 },
          functions: { total: 10, covered: 10, skipped: 0, pct: 100 },
          branches: { total: 150, covered: 150, skipped: 0, pct: 100 }
        }
      });

      sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

      expect(fixture.logs).toMatchSnapshot();
    });

    it('should report an improved result', async () => {
      /* coverage for file1 is better than before */
      await writeCoverage({
        ...fileCoverage,
        'src/file1.ts': {
          ...fileCoverage['src/file1.ts'],
          lines: { total: 100, covered: 60, skipped: 0, pct: 60 }
        }
      });

      const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(betterTestRun.better)).toEqual(['test']);

      /* file1 is gone */
      await writeCoverage({
        'src/file2.ts': fileCoverage['src/file2.ts']
      });

      const evenBetterTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(evenBetterTestRun.better)).toEqual(['test']);

      expect(fixture.logs).toMatchSnapshot();
    });

    it('should report a worse result', async () => {
      /* coverage for file1 is decreased */
      await writeCoverage({
        ...fileCoverage,
        'src/file1.ts': {
          ...fileCoverage['src/file1.ts'],
          lines: { total: 100, covered: 40, skipped: 0, pct: 40 }
        }
      });

      let worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

      /* coverage for file2 is increased, but coverage for file1 is decreased */
      await writeCoverage({
        'src/file1.ts': {
          ...fileCoverage['src/file1.ts'],
          lines: { total: 100, covered: 40, skipped: 0, pct: 40 }
        },
        'src/file2.ts': {
          ...fileCoverage['src/file2.ts'],
          lines: { total: 120, covered: 30, skipped: 0, pct: 25 }
        }
      });

      worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

      /* there is a new file and it is not 100% covered */
      await writeCoverage({
        ...fileCoverage,
        'src/file3.ts': {
          ...fileCoverage['src/file1.ts']
        }
      });

      worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

      expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

      expect(fixture.logs).toMatchSnapshot();
    });
  });
});
