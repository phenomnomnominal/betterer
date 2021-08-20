import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the existence of TSQuery matches', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture('tsquery', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  tsquery: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `console.log('foo');`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(newTestRun.new)).toEqual(['tsquery']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(sameTestRun.same)).toEqual(['tsquery']);

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(worseTestRun.worse)).toEqual(['tsquery']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(betterTestRun.better)).toEqual(['tsquery']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(completedTestRun.completed)).toEqual(['tsquery']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
