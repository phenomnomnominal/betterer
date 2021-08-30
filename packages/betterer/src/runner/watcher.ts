import { FSWatcher, watch } from 'chokidar';
import minimatch from 'minimatch';
import * as path from 'path';

import { BettererGlobals } from '../types';
import { normalisedPath } from '../utils';

export const WATCHER_EVENTS = ['add', 'change'];

export async function createWatcher(globals: BettererGlobals): Promise<FSWatcher | null> {
  const { config } = globals;

  if (!config.watch) {
    return null;
  }

  const { cachePath, cwd, resultsPath } = config;

  const watcher = watch(cwd, {
    ignoreInitial: true,
    ignored: (itemPath: string) => {
      itemPath = normalisedPath(itemPath);
      const isCwd = itemPath === normalisedPath(cwd);
      if (isCwd) {
        return false;
      }

      const isResultsPath = itemPath === normalisedPath(resultsPath);
      const isCachePath = itemPath === normalisedPath(cachePath);
      if (isResultsPath || isCachePath) {
        return true;
      }

      // read `ignores` here so that it can be updated by watch mode:
      const { ignores } = config;
      const watchIgnores = ignores.map((ignore) => path.join(cwd, ignore));
      const isIgnored = watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true }));
      return isIgnored;
    }
  });

  await new Promise((resolve, reject) => {
    watcher.on('ready', resolve);
    watcher.on('error', reject);
  });

  return watcher;
}
