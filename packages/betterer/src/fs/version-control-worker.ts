import { BettererError } from '@betterer/errors';
import findGitRoot from 'find-git-root';

import { BettererGit } from './git';
import { BettererFilePaths, BettererVersionControl } from './types';

let globalVersionControl: BettererVersionControl;

export async function init(): Promise<void> {
  const gitDir = findGitRoot(process.cwd());
  if (!gitDir) {
    throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
  }
  const git = new BettererGit(gitDir);
  await git.init();
  globalVersionControl = git;
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
