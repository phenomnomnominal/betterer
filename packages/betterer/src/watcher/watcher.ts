import { watch as chokidar, FSWatcher } from 'chokidar';

import { BettererContext } from '../context';
import { WatchChangesHandler } from './types';
import { WATCH_IGNORES } from './ignores';

const EMIT_EVENTS = ['add', 'change'];

export function watch(
  context: BettererContext,
  change: WatchChangesHandler
): FSWatcher {
  const cwd = process.cwd();
  const watcher = chokidar(cwd, {
    ignored: [
      ...WATCH_IGNORES.map(i => new RegExp(`${i}$`, 'i')),
      ...(context.config.ignore || [])
    ],
    cwd
  });
  watcher.on('all', (event: string, path: string) => {
    if (EMIT_EVENTS.includes(event)) {
      change(path);
    }
  });
  return watcher;
}
