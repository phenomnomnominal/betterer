import { describe, expect, it } from 'vitest';

import { simpleGit } from 'simple-git';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should merge concurrent results from different files with a plain three-way merge', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile } = await createFixture('results-directory-merge', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'regexp': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;
    const git = simpleGit(paths.cwd);

    process.env.BETTERER_WORKER = 'false';

    await git.init(['-b', 'master']);
    await git.addConfig('user.email', 'test@betterer.dev');
    await git.addConfig('user.name', 'betterer');

    await writeFile(resolve('./src/index.ts'), `// HACK`);
    await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    await git.add('-A');
    await git.commit('baseline');

    await git.checkoutLocalBranch('ours');
    await writeFile(resolve('./src/ours.ts'), `// HACK`);
    await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    await git.add('-A');
    await git.commit('ours');

    await git.checkout('master');
    await git.checkoutLocalBranch('theirs');
    await writeFile(resolve('./src/theirs.ts'), `// HACK`);
    await betterer({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    await git.add('-A');
    await git.commit('theirs');

    await git.checkout('ours');

    let hasConflict = false;
    try {
      await git.merge(['--no-edit', 'theirs']);
    } catch {
      hasConflict = true;
    }

    expect(hasConflict).toBe(false);
    const { conflicted } = await git.status();
    expect(conflicted).toEqual([]);

    await cleanup();
  });
});
