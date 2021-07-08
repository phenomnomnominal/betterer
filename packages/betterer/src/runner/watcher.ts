import { FSWatcher, watch } from 'chokidar';
import minimatch from 'minimatch';
import * as path from 'path';

import { BettererFilePaths } from '../fs';
import { BettererSuiteSummary } from '../suite';
import { BettererGlobals } from '../types';
import { normalisedPath } from '../utils';
import { BettererRunnerΩ } from './runner';
import { BettererRunner, BettererRunHandler } from './types';

const EMIT_EVENTS = ['add', 'change'];

export class BettererWatcherΩ implements BettererRunner {
  private readonly _runner: BettererRunner;
  private _watcher: FSWatcher;

  constructor(globals: BettererGlobals) {
    this._runner = new BettererRunnerΩ(globals);
    const { config } = globals;
    const { cwd, resultsPath } = config;

    this._watcher = watch(cwd, {
      ignoreInitial: true,
      ignored: (itemPath: string) => {
        // read `ignores` here so that it can be updated by watch mode:
        const { ignores } = config;
        const watchIgnores = [...ignores].map((ignore) => path.join(cwd, ignore));
        return (
          itemPath !== normalisedPath(cwd) &&
          (itemPath === normalisedPath(resultsPath) ||
            watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true })))
        );
      }
    });
  }

  public async setup(): Promise<void> {
    this._watcher.on('all', (event: string, filePath: string) => {
      if (EMIT_EVENTS.includes(event)) {
        void this._runner.queue([filePath]);
      }
    });

    await new Promise((resolve, reject) => {
      this._watcher.on('ready', resolve);
      this._watcher.on('error', reject);
    });
  }

  public queue(filePaths: string | BettererFilePaths, handler: BettererRunHandler): Promise<void> {
    return this._runner.queue(filePaths, handler);
  }

  public async stop(force: true): Promise<null>;
  public async stop(): Promise<BettererSuiteSummary>;
  public async stop(force?: true): Promise<BettererSuiteSummary | null> {
    await this._watcher.close();
    return await (force ? this._runner.stop(force) : this._runner.stop());
  }
}
