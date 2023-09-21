import { exposeToMain__ } from '@betterer/worker';
import { BettererGitΩ } from './git.js';
import { BettererFilePaths } from './types.js';

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

export function init(configPaths: BettererFilePaths, cwd: string): Promise<string> {
  return versionControl.init(configPaths, cwd);
}

export function sync(): Promise<void> {
  return versionControl.sync();
}

export function clearCache(testName: string): void {
  return versionControl.clearCache(testName);
}

export function filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths {
  return versionControl.filterCached(testName, filePaths);
}

export function enableCache(cachePath: string): Promise<void> {
  return versionControl.enableCache(cachePath);
}

export function updateCache(testName: string, filePaths: BettererFilePaths): void {
  return versionControl.updateCache(testName, filePaths);
}

export function writeCache(): Promise<void> {
  return versionControl.writeCache();
}

exposeToMain__({
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
