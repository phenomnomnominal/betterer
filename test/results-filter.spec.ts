import { betterer } from '@betterer/betterer';

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

    await betterer({ configPaths, resultsPath, workers: 1, silent: true });

    const results = await betterer.results({ configPaths, resultsPath, filters: [/test 1/] });

    const test1Results = results.results.find((result) => result.name === 'test 1');

    expect(test1Results).toBeDefined();
    expect(test1Results?.isFileTest).toEqual(true);
    expect(test1Results?.isFileTest && test1Results.results).toBeDefined();

    const test2Results = results.results.find((result) => result.name === 'test 2');
    expect(test2Results).not.toBeDefined();

    const test3Results = results.results.find((result) => result.name === 'test 3');
    expect(test3Results).not.toBeDefined();

    await cleanup();
  });
});
