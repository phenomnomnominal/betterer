import { BettererError } from '@betterer/errors';
import assert from 'assert';
import memoize from 'fast-memoize';
import * as path from 'path';
import { promises as fs } from 'fs';

import { BettererGit } from './git';
import { BettererVersionControl } from './types';

let globalVersionControl: BettererVersionControl;

export const createVersionControl = memoize(async function createVersionControl(): Promise<BettererVersionControl> {
  const git = new BettererGit(await findGitRoot());
  await git.init();
  globalVersionControl = git;
  return globalVersionControl;
});

export function getVersionControl(): BettererVersionControl {
  assert(globalVersionControl);
  return globalVersionControl;
}

async function findGitRoot(): Promise<string> {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    try {
      const gitPath = path.join(dir, '.git');
      await fs.access(gitPath);
      return gitPath;
    } catch (err) {
      dir = path.join(dir, '..');
    }
  }
  throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
}
