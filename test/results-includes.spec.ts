import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should return only the current results for an included file', async () => {
    const { paths, cleanup, resolve } = await createFixture('results-includes', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  'test': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts'),
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

    const resultsSummary = await betterer.results({ configPaths, resultsPath, includes: ['**/file-with-issues.ts'] });

    const testResultsSummary = resultsSummary.testResultSummaries.find(
      (testResultsSummary) => testResultsSummary.name === 'test'
    );

    const fileWithIssues = resolve('./src/file-with-issues.ts');
    const fileWithIssue = resolve('./src/file-with-issue.ts');

    const fileTestResultSummary = (!!testResultsSummary?.isFileTest && testResultsSummary.summary) || {};

    expect(fileTestResultSummary[fileWithIssues]).toBeDefined();
    expect(fileTestResultSummary[fileWithIssue]).not.toBeDefined();

    const fileWithIssuesResult = fileTestResultSummary[fileWithIssues];

    const [issue1, issue2] = fileWithIssuesResult;

    expect(issue1.message).toEqual('RegExp match');
    expect(issue1.line).toEqual(0);
    expect(issue1.column).toEqual(0);

    expect(issue2.message).toEqual('RegExp match');
    expect(issue2.line).toEqual(1);
    expect(issue2.column).toEqual(0);

    await cleanup();
  });
});
