import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test changes and makes the result better', async () => {
    const { logs, paths, readFile, cleanup, resolve, runNames } = await createFixture('better-test-change', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"]'
  ).include('./src/**/*.ts')
};  
      `,
      '.betterer.changed.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
      `,
      'src/index.ts': `
console.log('foo');
console.info('foo');
console.log('foo');
      `
    });
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths: [resolve('.betterer.ts')], resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['test']);

    const secondRun = await betterer({ configPaths: [resolve('.betterer.changed.ts')], resultsPath, workers: 1 });

    expect(runNames(secondRun.better)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
