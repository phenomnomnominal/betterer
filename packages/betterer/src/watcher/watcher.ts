import { watch as chokidar, FSWatcher } from 'chokidar';

import { BettererContext, BettererRuns } from '../context';
import { getNormalisedPath } from '../utils';
import { BettererWatchChangeHandler, BettererWatchRunHandler } from './types';
import { WATCH_IGNORES } from './ignores';

const EMIT_EVENTS = ['add', 'change'];
const DEBOUNCE_TIME = 200;

export class BettererWatcher {
  private _files: Array<string> = [];
  private _handlers: Array<BettererWatchRunHandler> = [];
  private _runs: Promise<BettererRuns> | null = null;
  private _watcher: FSWatcher | null = null;

  constructor(private readonly _context: BettererContext, private readonly _onChange: BettererWatchChangeHandler) {}

  public async setup(): Promise<void> {
    const { cwd, ignores, resultsPath } = this._context.config;

    const watcher = chokidar(cwd, {
      ignoreInitial: true,
      ignored: [...WATCH_IGNORES, ...ignores, resultsPath]
    });

    watcher.on('all', (event: string, filePath: string) => {
      if (EMIT_EVENTS.includes(event)) {
        this._files.push(getNormalisedPath(filePath));
        setTimeout(() => {
          if (this._files.length) {
            const changed = Array.from(new Set(this._files)).sort();
            this._files = [];
            this._handleChange(changed);
          }
        }, DEBOUNCE_TIME);
      }
    });

    await new Promise((resolve, reject) => {
      watcher.on('ready', resolve);
      watcher.on('error', reject);
    });
    this._watcher = watcher;
  }

  public async stop(): Promise<void> {
    if (this._watcher) {
      await this._watcher.close();
    }
    if (this._runs) {
      await this._handleRun(this._runs);
      this._context.tearDown();
    }
  }

  public onRun(handler: BettererWatchRunHandler): void {
    this._handlers.push(handler);
  }

  private _handleChange(changed: Array<string>): void {
    this._runs = this._onChange(changed);
    this._handleRun(this._runs);
  }

  private async _handleRun(running: Promise<BettererRuns>): Promise<BettererRuns> {
    const runs = await running;
    this._handlers.forEach((handler) => handler(runs));
    await this._context.process(runs);
    return runs;
  }
}
