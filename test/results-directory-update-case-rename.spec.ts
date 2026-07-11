import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should keep results when a test is renamed only by case with the update flag', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, readFile, resolve, writeFile, testNames } = await createFixture(
      'results-directory-update-case-rename',
      {
        '.betterer.ts': `
import { regexp } from '@betterer/regexp';

export default {
  'Regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
      }
    );

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['Regexp']);

    const configFile = await readFile(paths.config);
    await writeFile(paths.config, configFile.replace('Regexp', 'regexp'));

    const updateRun = await betterer({
      configPaths,
      resultsStrategy: 'directory',
      resultsDir,
      workers: false,
      update: true
    });
    expect(testNames(updateRun.removed)).toEqual(['Regexp']);
    expect(testNames(updateRun.new)).toEqual(['regexp']);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['regexp']);

    await cleanup();
  });
});
