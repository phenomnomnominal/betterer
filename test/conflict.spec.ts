import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should work when there is a merge conflict in the results file', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup } = await createFixture('conflict', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
              `,
      '.betterer.results': `
// BETTERER RESULTS V2.
exports[\`test\`] = {
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

    await betterer({ configPaths, resultsPath, workers: false });

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should report a read error, not a merge conflict, for a malformed file with marker substrings mid-line', async () => {
    const { merge } = await import('@betterer/betterer');

    const start = '<'.repeat(7);
    const separator = '='.repeat(7);
    const end = '>'.repeat(7);
    const { paths, cleanup } = await createFixture('conflict-midline', {
      '.betterer.results': [
        '// BETTERER RESULTS V2.',
        'exports[`test`] = {',
        `  value: \`${start} ${separator} ${end}\``,
        '} not valid javascript {{{'
      ].join('\n')
    });

    process.env.BETTERER_WORKER = 'false';
    const exitCode = process.exitCode;

    try {
      await merge({ resultsPath: paths.results });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toContain('could not read results');
    }

    process.exitCode = exitCode;
    await cleanup();
  });
});
