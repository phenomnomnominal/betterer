// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should normalise line endings within issues', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, testNames, resolve, readFile, writeFile } = await createFixture('file-test-line-endings', {
      '.betterer.js': `
const { BettererFileTest } = require('@betterer/betterer');
const { eslint } = require('@betterer/eslint');
const { promises: fs } = require('fs');

module.exports = {
  test: () => {
    return new BettererFileTest(async (filePaths, fileTestResult) => {
      await Promise.all(
        filePaths.map(async filePath => {
          const contents = await fs.readFile(filePath, 'utf-8');
          const file = fileTestResult.addFile(filePath, contents);
          file.addIssue(0, contents.length, '');
        }),
      );
    }).include('**/*.js')
  }
};
      `,
      'src/index.js': `
function test () {
  return;
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('src/index.js');

    const lfRun = await betterer({ configPaths, resultsPath, workers: false });
    expect(testNames(lfRun.ran)).toEqual(['test']);

    const lfResult = await readFile(resultsPath);
    expect(lfResult).toMatchSnapshot();

    const lf = await readFile(indexPath);
    const crlf = lf.replace(/\n/g, '\r\n');
    await writeFile(indexPath, crlf);

    const crlfRun = await betterer({ configPaths, resultsPath, workers: false, ci: true });
    expect(crlfRun.changed).toEqual([]);

    const crlfResult = await readFile(resultsPath);

    expect(crlfResult).toEqual(lfResult);

    await cleanup();
  });
});
