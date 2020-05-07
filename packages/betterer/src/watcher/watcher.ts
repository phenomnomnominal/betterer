import { watch as chokidar, FSWatcher } from 'chokidar';

import { BettererConfig } from '../config';
import { BettererWatchChangeHandler } from './types';
import { WATCH_IGNORES } from './ignores';

const EMIT_EVENTS = ['add', 'change'];

export async function watch(config: BettererConfig, change: BettererWatchChangeHandler): Promise<FSWatcher> {
  const watcher = chokidar(config.cwd, {
    ignoreInitial: true,
    ignored: [...WATCH_IGNORES, ...config.ignores]
  });
  watcher.on('all', (event: string, path: string) => {
    // TODO: Debounce and group files:
    if (EMIT_EVENTS.includes(event)) {
      change([path]);
    }
  });
  await new Promise((resolve, reject) => {
    watcher.on('ready', resolve);
    watcher.on('error', reject);
  });
  return watcher;
}
