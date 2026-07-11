import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should track a test whose name begins with dots', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory-dotted-name', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  '..shared': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['..shared']);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['..shared']);

    await cleanup();
  });
});
