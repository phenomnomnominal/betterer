import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

const CONFIG_BOTH = `
import { regexp } from '@betterer/regexp';

export default {
  'a': () => regexp(/(\\/\\/\\s*AAA)/g).include('./src/**/*.ts'),
  'b': () => regexp(/(\\/\\/\\s*BBB)/g).include('./src/**/*.ts')
};
`;

const CONFIG_A = `
import { regexp } from '@betterer/regexp';

export default {
  'a': () => regexp(/(\\/\\/\\s*AAA)/g).include('./src/**/*.ts')
};
`;

describe('betterer', () => {
  it('should delete a test recorded and then removed with the update flag in one runner session', async () => {
    const { betterer, runner } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture(
      'results-directory-mid-session-removed',
      { '.betterer.ts': CONFIG_BOTH }
    );

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// AAA\n// BBB`);

    // `b` added, then removed with `--update`, within one session:
    const bettererRunner = await runner({
      configPaths,
      resultsStrategy: 'directory',
      resultsDir,
      workers: false,
      update: true
    });
    await bettererRunner.queue([]);
    await writeFile(paths.config, CONFIG_A);
    await bettererRunner.queue([paths.config]);
    await bettererRunner.stop();

    const finalRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(finalRun.same)).toEqual(['a']);
    expect(testNames(finalRun.obsolete)).toEqual([]);

    await cleanup();
  });
});
