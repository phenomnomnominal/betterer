import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when there is a merge conflict in the results file', async () => {
    const { logs, paths, readFile, cleanup } = await createFixture('test-betterer-conflict', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console calls': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
              `,
      '.betterer.results': `
// BETTERER RESULTS V2.
exports[\`no raw console calls\`] = {
  value: \`{
|||<<<<<<< our-change
    \\"src/index.ts:315583663\\": [
      [0, 0, 11, \\"TSQuery match\\", \\"3870399096\\"],
      [1, 0, 11, \\"TSQuery match\\", \\"3870399096\\"]
    ]
|||=======
    \\"src/index.ts:913095150\\": [
      [0, 0, 11, \\"TSQuery match\\", \\"3870399096\\"]
    ]
|||>>>>>>> their-change
  }\`
};
      `.replace(/\|||/g, ''), // Mess with it a bit so that tooling doesn't think this is a real conflict:
      'src/index.ts': `
console.log('foo');
console.info('foo');
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, workers: 1 });

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
