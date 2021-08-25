import { mergeΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should merge the given contents', async () => {
    const { paths, cleanup, readFile } = await createFixture('merge-contents');

    const ours = `// BETTERER RESULTS V2.
exports[\`test\`] = {
  value: \`{
    \\"src/index.ts:315583663\\": [
      [0, 0, 11, \\"TSQuery match\\", \\"3870399096\\"],
      [1, 0, 11, \\"TSQuery match\\", \\"3870399096\\"]
    ]
  }\`
};
    `;
    const theirs = `// BETTERER RESULTS V2.
exports[\`test\`] = {
  value: \`{
    \\"src/index.ts:913095150\\": [
      [0, 0, 11, \\"TSQuery match\\", \\"3870399096\\"]
    ]
  }\`
};
        `;

    const resultsPath = paths.results;
    const fixturePath = paths.cwd;

    await mergeΔ(fixturePath, [...ARGV, ours, theirs]);

    const merged = await readFile(resultsPath);

    expect(merged).toMatchSnapshot();

    await cleanup();
  });
});
