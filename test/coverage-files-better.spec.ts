import { betterer } from '@betterer/betterer';
import { commonSetup, commonTeardown, fileCoverage, writeCoverage } from './coverage-test-helpers';

describe('betterer', () => {
  it('should report an improved file coverage result', async () => {
    const { fixture, configPaths, resultsPath } = await commonSetup('test-improved');

    /* coverage for file1 is better than before */
    await writeCoverage(fixture, {
      ...fileCoverage,
      'src/file1.ts': {
        ...fileCoverage['src/file1.ts'],
        lines: { total: 100, covered: 60, skipped: 0, pct: 60 }
      }
    });

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(betterTestRun.better)).toEqual(['test']);

    /* file1 is gone */
    await writeCoverage(fixture, {
      'src/file2.ts': fileCoverage['src/file2.ts']
    });

    const evenBetterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(evenBetterTestRun.better)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();
    await commonTeardown(fixture);
  });
});
