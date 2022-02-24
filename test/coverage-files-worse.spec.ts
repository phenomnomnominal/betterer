import { betterer } from '@betterer/betterer';
import { commonSetup, commonTeardown, fileCoverage, writeCoverage } from './coverage-test-helpers';

describe('betterer', () => {
  it('should report a worse file coverage result', async () => {
    const { fixture, configPaths, resultsPath } = await commonSetup('test-worse');
    /* coverage for file1 is decreased */
    await writeCoverage(fixture, {
      ...fileCoverage,
      'src/file1.ts': {
        ...fileCoverage['src/file1.ts'],
        lines: { total: 100, covered: 40, skipped: 0, pct: 40 }
      }
    });

    let worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

    /* coverage for file2 is increased, but coverage for file1 is decreased */
    await writeCoverage(fixture, {
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
    await writeCoverage(fixture, {
      ...fileCoverage,
      'src/file3.ts': {
        ...fileCoverage['src/file1.ts']
      }
    });

    worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();
    await commonTeardown(fixture);
  });
});
