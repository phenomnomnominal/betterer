import { describe, expect, it } from 'vitest';

import { existsSync } from 'node:fs';
import path from 'node:path';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should encode a test name containing filesystem-illegal characters', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile, testNames } = await createFixture('results-directory-illegal-name', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'no import *': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    const newRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(newRun.new)).toEqual(['no import *']);

    // `*` is illegal on Windows, so it is encoded rather than used raw:
    expect(existsSync(path.join(resultsDir, 'no%20import%20%2A'))).toBe(true);

    const sameRun = await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    expect(testNames(sameRun.same)).toEqual(['no import *']);

    await cleanup();
  });
});
