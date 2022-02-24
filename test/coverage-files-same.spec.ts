import { betterer } from '@betterer/betterer';
import { commonSetup, commonTeardown, fileCoverage, writeCoverage } from './coverage-test-helpers';

describe('betterer', () => {
  it('should report a stable per-file coverage result', async () => {
    const { fixture, configPaths, resultsPath, newTestRun } = await commonSetup('test-stable');

    expect(fixture.testNames(newTestRun.new)).toEqual(['test']);

    await betterer({ configPaths, resultsPath, workers: false });
    let sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

    const result = await fixture.readFile(resultsPath);
    expect(result).toMatchSnapshot();

    /* there is a new file but it is 100% covered */
    await writeCoverage(fixture, {
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
    await commonTeardown(fixture);
  });
});
