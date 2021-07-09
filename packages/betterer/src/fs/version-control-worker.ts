import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import * as path from 'path';

import { BettererGit } from './git';
import { BettererFilePaths, BettererVersionControl } from './types';

let globalVersionControl: BettererVersionControl;

export async function init(): Promise<void> {
  const gitDir = await findGitRoot();
  if (!gitDir) {
    throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
  }
  const git = new BettererGit(gitDir);
  await git.init();
  globalVersionControl = git;
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

export function filterCached(filePaths: BettererFilePaths): BettererFilePaths {
  return globalVersionControl.filterCached(filePaths);
}

export function filterIgnored(filePaths: BettererFilePaths): BettererFilePaths {
  return globalVersionControl.filterIgnored(filePaths);
}

export function enableCache(cachePath: string): Promise<void> {
  return globalVersionControl.enableCache(cachePath);
}

export function updateCache(filePaths: BettererFilePaths): void {
  return globalVersionControl.updateCache(filePaths);
}

export function writeCache(): Promise<void> {
  return globalVersionControl.writeCache();
}

export function add(resultsPath: string): Promise<void> {
  return globalVersionControl.add(resultsPath);
}

export function getFilePaths(): BettererFilePaths {
  return globalVersionControl.getFilePaths();
}

export function sync(): Promise<void> {
  return globalVersionControl.sync();
}
