import { watch as chokidar, FSWatcher } from 'chokidar';
import * as globby from 'globby';

import { BettererContextΩ, BettererSummary } from '../context';
import { getNormalisedPath } from '../utils';
import { BettererWatchChangeHandler, BettererWatchRunHandler, BettererWatcher } from './types';

const EMIT_EVENTS = ['add', 'change'];
const DEBOUNCE_TIME = 200;

export class BettererWatcherΩ implements BettererWatcher {
  private _files: Array<string> = [];
  private _handlers: Array<BettererWatchRunHandler> = [];
  private _running: Promise<BettererSummary> | null = null;
  private _watcher: FSWatcher | null = null;

  constructor(private readonly _context: BettererContextΩ, private readonly _onChange: BettererWatchChangeHandler) {}

  public async setup(): Promise<void> {
    const { cwd, ignores, resultsPath } = this._context.config;

    const isIgnored = globby.gitignore.sync();
    const watcher = chokidar(cwd, {
      ignoreInitial: true,
      ignored: (itemPath: string) => {
        return (
          itemPath !== getNormalisedPath(cwd) &&
          (itemPath === getNormalisedPath(resultsPath) || ignores.includes(itemPath) || isIgnored(itemPath))
        );
      }
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
    if (this._running) {
      await this._handleRun(this._running);
      this._context.end();
      await this._context.save();
    }
  }

  public onRun(handler: BettererWatchRunHandler): void {
    this._handlers.push(handler);
  }

  private _handleChange(changed: Array<string>): void {
    this._running = this._onChange(changed);
    void this._handleRun(this._running);
  }

  private async _handleRun(running: Promise<BettererSummary>): Promise<BettererSummary> {
    const summary = await running;
    this._handlers.forEach((handler) => handler(summary));
    return summary;
  }
}
