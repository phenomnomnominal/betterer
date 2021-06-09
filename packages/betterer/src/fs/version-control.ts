import { BettererError } from '@betterer/errors';
import assert from 'assert';
import memoize from 'fast-memoize';
import findGitRoot from 'find-git-root';

import { BettererGit } from './git';
import { BettererVersionControl } from './types';

let globalVersionControl: BettererVersionControl;

export const createVersionControl = memoize(async function createVersionControl(): Promise<BettererVersionControl> {
  const gitDir = findGitRoot(process.cwd());
  if (!gitDir) {
    throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
  }
  const git = new BettererGit(gitDir);
  await git.init();
  globalVersionControl = git;
  return globalVersionControl;
});

export function getVersionControl(): BettererVersionControl {
  assert(globalVersionControl);
  return globalVersionControl;
}
