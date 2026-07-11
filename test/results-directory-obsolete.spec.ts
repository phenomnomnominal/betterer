import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should report an obsolete test and remove only it with the update flag', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, readFile, resolve, writeFile, testNames } = await createFixture(
      'results-directory-obsolete',
      {
        '.betterer.ts': `
import { regexp } from '@betterer/regexp';

export default {
  'will be renamed': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
      }
    );

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['will be renamed']);

    const configFile = await readFile(paths.config);
    await writeFile(paths.config, configFile.replace('will be renamed', 'has been renamed'));

    const obsoleteRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(obsoleteRun.obsolete)).toEqual(['will be renamed']);
    expect(testNames(obsoleteRun.new)).toEqual(['has been renamed']);

    const updateRun = await betterer({
      configPaths,
      resultsStrategy: 'directory',
      resultsDir,
      workers: false,
      update: true
    });
    expect(testNames(updateRun.removed)).toEqual(['will be renamed']);
    expect(testNames(updateRun.same)).toEqual(['has been renamed']);

    await cleanup();
  });
});
