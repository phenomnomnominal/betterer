// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

import { simpleGit } from 'simple-git';

describe('betterer', () => {
  it('should not reinitialise the repository when run inside a git worktree', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { resolve, cleanup } = await createFixture('worktree', {
      'source/.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
      `,
      'source/src/index.ts': `// HACK:`
    });

    const sourcePath = resolve('source');
    const barePath = resolve('repo.git');
    const worktreePath = resolve('worktree');

    const source = simpleGit(sourcePath);
    await source.init();
    await source.addConfig('user.email', 'test@betterer.dev');
    await source.addConfig('user.name', 'Betterer Test');
    await source.add('.');
    await source.commit('init');
    const branch = (await source.revparse(['--abbrev-ref', 'HEAD'])).trim();

    await simpleGit(resolve('.')).clone(sourcePath, barePath, ['--bare']);

    const bare = simpleGit(barePath);
    await bare.raw('worktree', 'add', worktreePath, branch);

    expect((await bare.raw('config', '--get', 'core.bare')).trim()).toBe('true');

    await betterer({
      cwd: worktreePath,
      configPaths: [resolve('worktree/.betterer.js')],
      resultsPath: resolve('worktree/.betterer.results'),
      workers: false
    });

    expect((await bare.raw('config', '--get', 'core.bare')).trim()).toBe('true');

    await cleanup();
  });
});
