import type { FSWatcher } from 'chokidar';

import type { BettererOptions } from '../api/index.js';
import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererOptionsWatcher, BettererRunner } from './types.js';

import { BettererError } from '@betterer/errors';

import { BettererContextΩ } from '../context/index.js';
import { BettererFileResolverΩ } from '../fs/index.js';
import { createGlobals } from '../globals.js';
import { normalisedPath } from '../utils.js';
import { createWatcher, WATCHER_EVENTS } from './watcher.js';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<void> | null = null;

  private constructor(
    private readonly _config: BettererConfig,
    private readonly _context: BettererContextΩ,
    private readonly _versionControl: BettererVersionControlWorker,
    private readonly _watcher: FSWatcher | null = null
  ) {}

  public static async create(
    options: BettererOptions,
    optionsWatch: BettererOptionsWatcher = {}
  ): Promise<BettererRunnerΩ> {
    const { config, results, versionControl } = await createGlobals(options, optionsWatch);
    const watcher = await createWatcher(config);

    const context = new BettererContextΩ(config, results, versionControl);
    const runner = new BettererRunnerΩ(config, context, versionControl, watcher);

    if (watcher) {
      watcher.on('all', (event: string, filePath: string) => {
        if (WATCHER_EVENTS.includes(event)) {
          void runner.queue([filePath]);
        }
      });
    }

    return runner;
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    await this._context.options(optionsOverride);
  }

  public async run(): Promise<BettererSuiteSummary> {
    await this._resolveFilesAndRun([], true);
    return await this._context.stop();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    if (this._context.isDestroyed) {
      throw new BettererError('You cannot queue a test run after the runner has been stopped! 💥');
    }
    this._addJob(filePaths);
    return new Promise((resolve) => {
      setTimeout(() => {
        void (async () => {
          await this._processQueue();
          resolve();
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(): Promise<BettererSuiteSummary>;
  public async stop(force: true): Promise<BettererSuiteSummary | null>;
  public async stop(force?: true): Promise<BettererSuiteSummary | null> {
    try {
      if (!force) {
        await this._running;
      }
      if (this._watcher) {
        await this._watcher.close();
      }
      return await this._context.stop();
    } catch (error) {
      if (force) {
        return null;
      }
      throw error;
    }
  }

  private _addJob(filePaths: BettererFilePaths = []): void {
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push(normalisedPaths);
  }

  private async _processQueue(): Promise<void> {
    // It's possible for the queue debounce to trigger *after* `this.stop()` has been called:
    if (this._context.isDestroyed) {
      this._jobs = [];
      return;
    }

    if (this._jobs.length) {
      const filePaths = new Set<string>();
      this._jobs.forEach((job) => {
        job.forEach((path) => {
          filePaths.add(path);
        });
      });
      const runPaths = Array.from(filePaths).sort();
      this._jobs = [];

      this._running = this._resolveFilesAndRun(runPaths);
      try {
        await this._running;
      } catch {
        // Errors will be handled by reporters
      }
    }
  }

  private async _resolveFilesAndRun(specifiedFilePaths: BettererFilePaths, isRunOnce = true): Promise<void> {
    await this._versionControl.api.sync();

    const { cwd, includes, excludes } = this._config;

    const resolver = new BettererFileResolverΩ(cwd, this._versionControl);
    resolver.include(...includes);
    resolver.exclude(...excludes);

    const hasSpecifiedFiles = specifiedFilePaths.length > 0;
    const hasGlobalIncludesExcludes = includes.length || excludes.length;

    let filePaths: BettererFilePaths;
    if (hasSpecifiedFiles && hasGlobalIncludesExcludes) {
      // Validate specified files based on global `includes`/`excludes and gitignore rules:
      filePaths = await resolver.validate(specifiedFilePaths);
    } else if (hasSpecifiedFiles) {
      // Validate specified files based on gitignore rules:
      filePaths = await resolver.validate(specifiedFilePaths);
    } else if (hasGlobalIncludesExcludes) {
      // Resolve files based on global `includes`/`excludes and gitignore rules:
      filePaths = await resolver.files();
    } else {
      // When `filePaths` is `[]` the test will use its specific resolver:
      filePaths = [];
    }

    return await this._context.run(filePaths, isRunOnce);
  }
}
