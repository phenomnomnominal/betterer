import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets better', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture(
      'test-betterer-better',
      {
        '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller, bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);
const shrinks = persist(__dirname, 'shrinks', 2);

module.exports = {
  'should shrink': () => new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.increment(),
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
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(secondRun.better)).toEqual(['should shrink', 'should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should work when a test changes and makes the results better', async () => {
    const { logs, paths, readFile, cleanup, resolve, runNames } = await createFixture(
      'test-betterer-better-change-test',
      {
        '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console calls': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"]'
  ).include('./src/**/*.ts')
};  
      `,
        '.betterer.changed.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console calls': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
      `,
        'src/index.ts': `
console.log('foo');
console.info('foo');
console.log('foo');
      `
      }
    );
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths: [resolve('.betterer.ts')], resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['no raw console calls']);

    const secondRun = await betterer({ configPaths: [resolve('.betterer.changed.ts')], resultsPath, workers: 1 });

    expect(runNames(secondRun.better)).toEqual(['no raw console calls']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
