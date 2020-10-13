import { FSWatcher, watch as chokidar } from 'chokidar';
import globby from 'globby';
import minimatch from 'minimatch';
import * as path from 'path';

import { BettererContext, BettererContextΩ, BettererSummary } from '../context';
import { normalisedPath } from '../utils';
import { BettererWatchChangeHandler, BettererWatchRunHandler, BettererWatcher } from './types';

const EMIT_EVENTS = ['add', 'change'];
const DEBOUNCE_TIME = 200;
const GIT_DIRECTORY = '.git/**';

export class BettererWatcherΩ implements BettererWatcher {
  private _files: Array<string> = [];
  private _handlers: Array<BettererWatchRunHandler> = [];
  private _running: Promise<BettererSummary> | null = null;
  private _watcher: FSWatcher | null = null;

  constructor(private readonly _context: BettererContext, private readonly _onChange: BettererWatchChangeHandler) {}

  public async setup(): Promise<void> {
    const contextΩ = this._context as BettererContextΩ;
    const { cwd, ignores, resultsPath } = contextΩ.config;

    const isGitIgnored = globby.gitignore.sync();
    const watchIgnores = [...ignores, GIT_DIRECTORY].map((ignore) => path.join(cwd, ignore));
    const watcher = chokidar(cwd, {
      ignoreInitial: true,
      ignored: (itemPath: string) => {
        return (
          itemPath !== normalisedPath(cwd) &&
          (itemPath === normalisedPath(resultsPath) ||
            watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true })) ||
            isGitIgnored(itemPath))
        );
      }
    });

    watcher.on('all', (event: string, filePath: string) => {
      if (EMIT_EVENTS.includes(event)) {
        this._files.push(normalisedPath(filePath));
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
      const contextΩ = this._context as BettererContextΩ;
      await contextΩ.end();
      await contextΩ.save();
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
