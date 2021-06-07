import { FSWatcher, watch } from 'chokidar';
import minimatch from 'minimatch';
import * as path from 'path';

import { BettererConfig } from '../config';
import { BettererSummary } from '../context';
import { BettererFilePaths, BettererVersionControl } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { normalisedPath } from '../utils';
import { BettererRunnerΩ } from './runner';
import { BettererRunner, BettererRunHandler } from './types';

const EMIT_EVENTS = ['add', 'change'];

export class BettererWatcherΩ implements BettererRunner {
  private readonly _runner: BettererRunner;
  private _watcher: FSWatcher;

  constructor(config: BettererConfig, reporter: BettererReporterΩ, versionControl: BettererVersionControl) {
    this._runner = new BettererRunnerΩ(config, reporter, versionControl);
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
  public async stop(): Promise<BettererSummary>;
  public async stop(force?: true): Promise<BettererSummary | null> {
    await this._watcher.close();
    return await (force ? this._runner.stop(force) : this._runner.stop());
  }
}
