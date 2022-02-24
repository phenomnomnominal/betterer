import { betterer } from '@betterer/betterer';
import { BettererCoverageIssues } from '@betterer/coverage';
import { commonSetup, commonTeardown, totalCoverage, writeCoverage } from './coverage-test-helpers';

describe('betterer', () => {
  it('should report the total coverage', async () => {
    const bettererConfig = `
const { coverage } = require('@betterer/coverage');

module.exports = {
test: () => coverage({ totalCoverage: true, baseDir: __dirname })
};      
    `;
    const { fixture, configPaths, resultsPath, newTestRun } = await commonSetup('total', bettererConfig);

    expect(fixture.testNames(newTestRun.new)).toEqual(['test']);

    const result = await fixture.readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(sameTestRun.same)).toEqual(['test']);

    const testResult = sameTestRun.same[0].result?.value as BettererCoverageIssues;
    expect(testResult.total).toEqual({
      lines: 4931 - 227,
      statements: 5185 - 236,
      functions: 1340 - 31,
      branches: 3025 - 83
    });

    const myCoverage = {
      ...totalCoverage
    };

    myCoverage.lines.covered += 100;

    await writeCoverage(fixture, {}, myCoverage);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(betterTestRun.better)).toEqual(['test']);

    myCoverage.branches.covered -= 10;

    await writeCoverage(fixture, {}, myCoverage);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(fixture.testNames(worseTestRun.worse)).toEqual(['test']);

    expect(fixture.logs).toMatchSnapshot();

    await commonTeardown(fixture);
  });
});
