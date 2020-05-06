import { watch as chokidar, FSWatcher } from 'chokidar';

import { BettererContext } from '../context';
import { BettererWatchChangeHandler } from './types';
import { WATCH_IGNORES } from './ignores';

const EMIT_EVENTS = ['add', 'change'];

export function watch(context: BettererContext, change: BettererWatchChangeHandler): FSWatcher {
  const watcher = chokidar(context.config.cwd, {
    ignoreInitial: true,
    ignored: [...WATCH_IGNORES, ...(context.config.ignores || [])]
  });
  watcher.on('all', (event: string, path: string) => {
    // TODO: Debounce and group files:
    if (EMIT_EVENTS.includes(event)) {
      change([path]);
    }
  });
  return watcher;
}
