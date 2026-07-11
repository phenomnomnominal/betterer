import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should report a clear error when getIssues is called with an unknown file path', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup } = await createFixture('file-test-result-unknown-path', {
      'target.txt': 'x',
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default {
  t: () => new BettererFileTest((filePaths, fileTestResult) => {
    fileTestResult.getIssues('/definitely/not/added.txt');
  }).include('**/*.txt')
};
      `
    });

    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false
    });

    const [failed] = suite.failed;
    expect(failed?.error?.message).toContain('could not find file');

    await cleanup();
  });
});
