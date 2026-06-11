// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

import { exec as execΩ } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execΩ);

describe('betterer', () => {
  it('should not reinitialise the repository when run inside a git worktree', async () => {
    const { betterer } = await import('@betterer/betterer');

    // The fixture directory is our scratch space. Inside it we build the popular "bare repo +
    // linked worktree" layout, where the worktree's `.git` is a gitfile pointing into a shared
    // common (bare) git dir. Running `git init` from inside the worktree reinitialises against
    // that *shared* dir and flips its `core.bare` to `false`, breaking every worktree on the repo.
    const { paths, cleanup } = await createFixture('worktree', {});

    const root = paths.cwd;
    const sourcePath = path.posix.join(root, 'source');
    const barePath = path.posix.join(root, 'repo.git');
    const worktreePath = path.posix.join(root, 'worktree');

    async function git(cwd: string, command: string): Promise<string> {
      const { stdout } = await exec(`git ${command}`, { cwd });
      return stdout.trim();
    }

    // 1. Create a source repository with a Betterer config and a file to lint:
    await fs.mkdir(path.posix.join(sourcePath, 'src'), { recursive: true });
    await fs.writeFile(
      path.posix.join(sourcePath, '.betterer.js'),
      [
        `const { regexp } = require('@betterer/regexp');`,
        ``,
        `module.exports = {`,
        `  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')`,
        `};`
      ].join('\n')
    );
    await fs.writeFile(path.posix.join(sourcePath, 'src', 'index.ts'), `// HACK:`);
    await git(sourcePath, 'init -q');
    await git(sourcePath, 'config user.email test@betterer.dev');
    await git(sourcePath, 'config user.name "Betterer Test"');
    await git(sourcePath, 'add -A');
    await git(sourcePath, 'commit -qm "init"');
    const branch = await git(sourcePath, 'symbolic-ref --short HEAD');

    // 2. Create a bare clone to act as the shared common git dir:
    await git(root, `clone -q --bare "${sourcePath}" "${barePath}"`);

    // 3. Add a linked worktree off the bare repo:
    await git(barePath, `worktree add -q "${worktreePath}" ${branch}`);

    // The shared common dir is bare to begin with:
    expect(await git(barePath, 'config --get core.bare')).toBe('true');

    // 4. Run Betterer inside the worktree:
    await betterer({
      cwd: worktreePath,
      configPaths: [path.posix.join(worktreePath, '.betterer.js')],
      resultsPath: path.posix.join(worktreePath, '.betterer.results'),
      workers: false
    });

    // 5. The shared common-dir config must be untouched:
    expect(await git(barePath, 'config --get core.bare')).toBe('true');

    await cleanup();
  });
});
