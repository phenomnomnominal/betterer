import { createFixture } from '../fixture';

import { cli__ } from '@betterer/cli';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should merge the results file', async () => {
    const { paths, cleanup, readFile } = await createFixture('merge-path', {
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
      `.replace(/\|||/g, '')
    });

    const resultsPath = paths.results;
    const fixturePath = paths.cwd;

    await cli__(fixturePath, [...ARGV, 'merge']);

    const merged = await readFile(resultsPath);

    expect(merged).toMatchSnapshot();

    await cli__(fixturePath, [...ARGV, 'merge', '--results', resultsPath]);

    const unchanged = await readFile(resultsPath);

    expect(unchanged).toMatchSnapshot();

    await cleanup();
  });
});
