// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should merge the given contents', async () => {
    const { paths, cleanup, readFile } = await createFixture('merge-contents', {
      '.betterer.results': ''
    });

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

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'merge', ours, theirs]);

    const merged = await readFile(resultsPath);

    expect(merged).toMatchSnapshot();

    await cleanup();
  });
});
