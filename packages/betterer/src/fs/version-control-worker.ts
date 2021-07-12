import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import * as path from 'path';

import { BettererGit } from './git';

export const git = new BettererGit();

export async function init(): Promise<void> {
  const gitDir = await findGitRoot();
  if (!gitDir) {
    throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
  }
  await git.init(gitDir);
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
