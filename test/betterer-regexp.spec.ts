import { betterer } from '@betterer/betterer';
import { createFixtureΔ } from '@betterer/fixture';

describe('betterer', () => {
  it('should report the existence of RegExp matches', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixtureΔ(
      'test-betterer-regexp',
      {
        '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
'regexp no hack comments': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
    `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['regexp no hack comments']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['regexp no hack comments']);

    await writeFile(indexPath, `// HACK:\n// HACK:`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(worseTestRun.worse)).toEqual(['regexp no hack comments']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(betterTestRun.better)).toEqual(['regexp no hack comments']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(completedTestRun.completed)).toEqual(['regexp no hack comments']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no regexp', async () => {
    const { paths, logs, cleanup } = await createFixtureΔ('test-betterer-regexp-no-regexp', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
'regexp no hack comments': regexp()
};      
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
