import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should keep results when a source file is renamed only by case', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { deleteFile, paths, cleanup, resolve, writeFile, testNames } = await createFixture(
      'results-directory-case-rename',
      {
        '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
      }
    );

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/Index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['regexp']);

    await deleteFile(resolve('./src/Index.ts'));
    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['regexp']);

    const stillSameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(stillSameRun.same)).toEqual(['regexp']);

    await cleanup();
  });
});
