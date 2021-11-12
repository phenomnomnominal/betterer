import { betterer } from '@betterer/betterer';
import { results__ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should report the current results for a file test', async () => {
    const { logs, paths, cleanup } = await createFixture('results-file-test', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
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
    const fixturePath = paths.cwd;

    await betterer({ configPaths, resultsPath, workers: false, silent: true });

    await results__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
