import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should track a renamed file as a move', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, deleteFile, testNames } = await createFixture(
      'results-directory-rename',
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

    await writeFile(resolve('./src/a.ts'), `// HACK`);
    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['regexp']);

    await deleteFile(resolve('./src/a.ts'));
    await writeFile(resolve('./src/b.ts'), `// HACK`);
    const renamedRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(renamedRun.same)).toEqual(['regexp']);
    expect(testNames(renamedRun.worse)).toEqual([]);

    await cleanup();
  });
});
