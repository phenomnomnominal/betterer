import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should escape interpolation characters in the result file', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile } = await createFixture('results-escape', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';

function test(): BettererFileTest {
  return new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, "\`$" + "{key}\`");
  });
}

export default {
  test: () => test().include('./src/**/*.ts')
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await writeFile(resolve('./src/index.ts'), '');

    // First run to create .betterer.results file:
    await betterer({ configPaths, resultsPath, workers: 1 });

    // Second run to make sure it doesn't throw when reading results:
    await betterer({ configPaths, resultsPath, workers: 1 });

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
