import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets worse', async () => {
    const { paths, logs, resolve, readFile, cleanup, runNames } = await createFixture(
      'test-betterer-worse',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller, bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const shrinks = persist(__dirname, 'shrinks', 2);
const grows = persist(__dirname, 'grows', 0);

module.exports = {
  'should shrink': () => new BettererTest({
    test: () => shrinks.increment(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.decrement(),
    constraint: bigger
  })
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const configPaths = [paths.config];
    const resultsPath = resolve(paths.results);

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(secondRun.worse)).toEqual(['should shrink', 'should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should not stay worse if an update is forced', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-update',
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

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');`);

    const worseTestRun = await betterer({ configPaths, resultsPath, update: true, workers: 1 });

    expect(runNames(worseTestRun.updated)).toEqual(['tsquery no raw console.log']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(sameTestRun.same)).toEqual(['tsquery no raw console.log']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should stay worse if an update is not allowed', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-no-update',
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

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');`);

    // @ts-expect-error `strict` and `true` are mutually exclusive, but could be set via JS:
    const blockedTestRun = await betterer({ configPaths, resultsPath, strict: true, update: true, workers: 1 });

    expect(runNames(blockedTestRun.worse)).toEqual(['tsquery no raw console.log']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
