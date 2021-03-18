import { FSWatcher, watch } from 'chokidar';
import globby from 'globby';
import minimatch from 'minimatch';
import * as path from 'path';

import { BettererSummary } from '../context';
import { BettererReporterΩ } from '../reporters';
import { normalisedPath } from '../utils';
import { BettererRunHandler } from './types';
import { BettererConfig } from '../config';
import { BettererRunnerΩ } from './runner';
import { BettererFilePaths, BettererRunner } from './types';

const EMIT_EVENTS = ['add', 'change'];
const GIT_DIRECTORY = '.git/**';

export class BettererWatcherΩ implements BettererRunner {
  private readonly _runner: BettererRunner;
  private _watcher: FSWatcher;

  constructor(config: BettererConfig, reporter: BettererReporterΩ) {
    this._runner = new BettererRunnerΩ(config, reporter);
    const { cwd, resultsPath } = config;

    this._watcher = watch(cwd, {
      ignoreInitial: true,
      ignored: (itemPath: string) => {
        const isGitIgnored = globby.gitignore.sync();
        // read `ignores` here so that it can be updated by watch mode:
        const { ignores } = config;
        const watchIgnores = [...ignores, GIT_DIRECTORY].map((ignore) => path.join(cwd, ignore));
        return (
          itemPath !== normalisedPath(cwd) &&
          (itemPath === normalisedPath(resultsPath) ||
            watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true })) ||
            isGitIgnored(itemPath))
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
