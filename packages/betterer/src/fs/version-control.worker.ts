import { exposeToMainΔ } from '@betterer/worker';
import { BettererGitΩ } from './git.js';
import type { BettererFilePaths } from './types.js';

export const versionControl = new BettererGitΩ();

export function add(resultsPath: string): Promise<void> {
  return versionControl.add(resultsPath);
}

export function filterIgnored(filePaths: BettererFilePaths): BettererFilePaths {
  return versionControl.filterIgnored(filePaths);
}

export function getFilePaths(): BettererFilePaths {
  return versionControl.getFilePaths();
}

export function init(configPaths: BettererFilePaths, cwd: string, ci: boolean): Promise<string> {
  return versionControl.init(configPaths, cwd, ci);
}

export function sync(): Promise<void> {
  return versionControl.sync();
}

export function clearCache(testName: string): void {
  versionControl.clearCache(testName);
}

export function filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths {
  return versionControl.filterCached(testName, filePaths);
}

export function enableCache(cachePath: string): Promise<void> {
  return versionControl.enableCache(cachePath);
}

export function updateCache(testName: string, filePaths: BettererFilePaths): void {
  versionControl.updateCache(testName, filePaths);
}

export function writeCache(): Promise<void> {
  return versionControl.writeCache();
}

exposeToMainΔ({
  add,
  filterIgnored,
  getFilePaths,
  init,
  sync,
  clearCache,
  filterCached,
  enableCache,
  updateCache,
  writeCache
});
