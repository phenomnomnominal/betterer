import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the existence of TSQuery matches', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-tsquery',
      {
        '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
    `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `console.log('foo');`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(newTestRun.new)).toEqual(['tsquery no raw console.log']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(sameTestRun.same)).toEqual(['tsquery no raw console.log']);

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(worseTestRun.worse)).toEqual(['tsquery no raw console.log']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(betterTestRun.better)).toEqual(['tsquery no raw console.log']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(completedTestRun.completed)).toEqual(['tsquery no raw console.log']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no query', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-tsquery-no-query', {
      '.betterer.js': `
const { tsquery } = require('@betterer/tsquery');

module.exports = {
  'tsquery no raw console.log': () => tsquery()
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
