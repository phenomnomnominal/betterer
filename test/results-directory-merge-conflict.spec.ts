import { describe, expect, it } from 'vitest';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createFixture } from './fixture.js';

const CONFLICT = `<<<<<<< HEAD
[0,0,6,"RegExp match","1a"]
=======
[1,0,6,"RegExp match","1a"]
>>>>>>> branch
`;

describe('betterer', () => {
  it('should throw when an issue file contains a merge conflict', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile } = await createFixture('results-directory-merge-conflict', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });

    const issueDir = path.join(resultsDir, 'regexp', 'src', 'index.ts');
    const [issueFile] = await fs.readdir(issueDir);
    await writeFile(path.join(issueDir, issueFile), CONFLICT);

    try {
      await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toContain('merge conflict');
    }

    await cleanup();
  });
});
