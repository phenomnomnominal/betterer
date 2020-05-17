import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets better', async () => {
    const { logs, paths, readFile, cleanup } = await createFixture('test-betterer-better', {
      '.betterer.js': `
const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;
let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  },
  'should grow': {
    test: () => grows++,
    constraint: bigger
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['should shrink', 'should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should work when a test changes and makes the results better', async () => {
    const { logs, paths, readFile, cleanup, resolve } = await createFixture('test-betterer-better-change-test', {
      '.betterer.ts': `
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console calls': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"]'
  )
};  
      `,
      '.betterer.changed.ts': `
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console calls': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
              `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": ["../../node_modules/@types/"],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*", ".betterer.ts"]
}      
      `,
      'src/index.ts': `
console.log('foo');
console.info('foo');
console.log('foo');
      `
    });
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths: [resolve('.betterer.ts')], resultsPath });

    expect(firstRun.new).toEqual(['no raw console calls']);

    const secondRun = await betterer({ configPaths: [resolve('.betterer.changed.ts')], resultsPath });

    expect(secondRun.better).toEqual(['no raw console calls']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
