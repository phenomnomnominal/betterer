import { watch as chokidar, FSWatcher } from 'chokidar';
import * as globby from 'globby';
import * as minimatch from 'minimatch';
import * as path from 'path';

import { BettererContext, BettererRuns } from '../context';
import { getNormalisedPath } from '../utils';
import { BettererWatchChangeHandler, BettererWatchRunHandler } from './types';

const EMIT_EVENTS = ['add', 'change'];
const DEBOUNCE_TIME = 200;
const GIT_DIRECTORY = '.git/**';

export class BettererWatcher {
  private _files: Array<string> = [];
  private _handlers: Array<BettererWatchRunHandler> = [];
  private _runs: Promise<BettererRuns> | null = null;
  private _watcher: FSWatcher | null = null;

  constructor(private readonly _context: BettererContext, private readonly _onChange: BettererWatchChangeHandler) {}

  public async setup(): Promise<void> {
    const { cwd, ignores, resultsPath } = this._context.config;

    const isGitIgnored = globby.gitignore.sync();
    const watchIgnores = [...ignores, GIT_DIRECTORY].map((ignore) => path.join(cwd, ignore));
    const watcher = chokidar(cwd, {
      ignoreInitial: true,
      ignored: (itemPath: string) => {
        return (
          itemPath !== getNormalisedPath(cwd) &&
          (itemPath === getNormalisedPath(resultsPath) ||
            watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true })) ||
            isGitIgnored(itemPath))
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
    void this._handleRun(this._runs);
  }

  private async _handleRun(running: Promise<BettererRuns>): Promise<BettererRuns> {
    const runs = await running;
    this._handlers.forEach((handler) => handler(runs));
    await this._context.process(runs);
    return runs;
  }
}
