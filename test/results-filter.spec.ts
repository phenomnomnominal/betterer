import { betterer, results } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should return only the current results for a filtered test', async () => {
    const { paths, cleanup } = await createFixture('results-filter', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  'test 1': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts'),
  'test 2': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts'),
  'test 3': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
    `,
      'src/file-with-issue.ts': `
// HACK:
    `,
      'src/file-with-issues.ts': `
// HACK:
// HACK:
    `,
      'src/file-with-no-issues.ts': ``
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, workers: false, silent: true });

    const resultsSummary = await results({ configPaths, resultsPath, filters: [/test 1/] });

    const test1ResultsSummary = resultsSummary.testResultSummaries.find(
      (testResultsSummary) => testResultsSummary.name === 'test 1'
    );

    expect(test1ResultsSummary).toBeDefined();
    expect(test1ResultsSummary?.isFileTest).toEqual(true);
    expect(test1ResultsSummary?.isFileTest && test1ResultsSummary.summary).toBeDefined();

    const test2ResultsSummary = resultsSummary.testResultSummaries.find(
      (testResultsSummary) => testResultsSummary.name === 'test 2'
    );
    expect(test2ResultsSummary).not.toBeDefined();

    const test3ResultsSummary = resultsSummary.testResultSummaries.find(
      (testResultsSummary) => testResultsSummary.name === 'test 3'
    );
    expect(test3ResultsSummary).not.toBeDefined();

    await cleanup();
  });
});
