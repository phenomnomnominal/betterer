import type { FSWatcher } from 'chokidar';
import type { BettererOptions } from '../api/index.js';
import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererContextSummary } from '../context/index.js';
import type { BettererFilePaths, BettererOptionsWatcher } from '../fs/index.js';
import type { BettererSuiteSummary, BettererSuiteΩ } from '../suite/index.js';
import type { BettererRunner } from './types.js';

import { BettererError } from '@betterer/errors';
import minimatch from 'minimatch';

import { BettererContextΩ } from '../context/index.js';
import { createWatcher, isTempFilePath, WATCHER_EVENTS } from '../fs/index.js';
import { createGlobals, destroyGlobals, getGlobals } from '../globals.js';
import { isResultsPath } from '../results/index.js';
import { normalisedPath } from '../utils.js';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  public config: BettererConfig;
  public readonly lifecycle = Promise.withResolvers<BettererContextSummary>();

  private _reporterContextStart: Promise<void>;
  private _isRunOnce = false;
  private _isStopped = false;
  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<BettererSuiteSummary> | null = null;

  private constructor(
    private readonly _context: BettererContextΩ,
    private readonly _watcher: FSWatcher | null
  ) {
    const { config, reporter } = getGlobals();

    this.config = config;

    const reporterΩ = reporter;
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    this._reporterContextStart = reporterΩ.contextStart(this, this.lifecycle.promise);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
    process.on('SIGTERM', this._sigterm);

    if (this._watcher) {
      this._watcher.on('all', (event: string, filePath: string) => {
        if (this._shouldQueue(event, filePath)) {
          void this.queue([filePath]);
        }
      });
    }
  }

  public static async create(
    options: BettererOptions,
    optionsWatcher: BettererOptionsWatcher = {}
  ): Promise<BettererRunnerΩ> {
    await createGlobals(options, optionsWatcher);
    const watcher = await createWatcher();
    const context = new BettererContextΩ();

    return new BettererRunnerΩ(context, watcher);
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    await this._context.options(optionsOverride);
    await this._restart(optionsOverride);
  }

  public async run(): Promise<BettererContextSummary> {
    this._isRunOnce = true;
    await this.queue([]);
    return await this.stop();
  }

  public async queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    if (this._isStopped) {
      throw new BettererError('You cannot queue a test run after the runner has been stopped! 💥');
    }
    this._addJob(filePaths);
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(
          () => {
            void (async () => {
              try {
                await this._processQueue();
                resolve();
              } catch (error) {
                reject(error as BettererError);
              }
            })();
          },
          this._isRunOnce ? 0 : DEBOUNCE_TIME
        );
      });
    } catch (error) {
      await this.stop();
      throw error;
    }
  }

  public async stop(): Promise<BettererContextSummary>;
  public async stop(force: true): Promise<BettererContextSummary | null>;
  public async stop(force?: true): Promise<BettererContextSummary | null> {
    if (this._isStopped) {
      return null;
    }

    const { reporter } = getGlobals();
    const reporterΩ = reporter;

    try {
      this._isStopped = true;

      if (this._watcher) {
        await this._watcher.close();
      }

      if (force) {
        return null;
      }

      await this._running;

      const contextSummary = await this._context.stop();

      if (contextSummary.suites.length === 0) {
        throw new BettererError('You cannot stop a runner before it has run any tests! 💥');
      }

      const { config, fs, results } = getGlobals();

      if (!config.ci && this._isRunOnce) {
        const writtenPath = await results.write();
        if (writtenPath && config.precommit) {
          await fs.api.add(writtenPath);
        }
      }

      if (config.cache) {
        await fs.api.writeCache();
      }

      // Lifecycle promise is resolved, so it's safe to await
      // the result of `reporter.contextStart`:
      this.lifecycle.resolve(contextSummary);
      await this._reporterContextStart;

      await reporterΩ.contextEnd(contextSummary);

      return contextSummary;
    } catch (error) {
      // Lifecycle promise is rejected, so it's safe to await
      // the result of `reporter.contextStart`:
      this.lifecycle.reject(error as BettererError);
      await this._reporterContextStart;

      await reporterΩ.contextError(this, error as BettererError);

      throw error;
    } finally {
      await destroyGlobals();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
      process.off('SIGTERM', this._sigterm);
    }
  }

  private _shouldQueue(event: string, itemPath: string): boolean {
    if (!WATCHER_EVENTS.includes(event)) {
      return false;
    }

    const { config } = getGlobals();
    const { cachePath, cwd } = config;

    itemPath = normalisedPath(itemPath);
    const normalisedCwd = normalisedPath(cwd);
    const isCwd = itemPath === normalisedPath(normalisedCwd);
    if (isCwd) {
      return true;
    }

    const isGitPath = itemPath.includes('.git');
    const isCachePath = itemPath === normalisedPath(cachePath);
    const isTempPath = isTempFilePath(itemPath);
    if (isGitPath || isResultsPath(config, itemPath) || isCachePath || isTempPath) {
      return false;
    }

    // read `ignores` here so that it can be updated by watch mode:
    const { ignores } = config;
    const watchIgnores = ignores.map((ignore) => `${normalisedCwd}/${ignore}`);
    const isIgnored = watchIgnores.some((ignore) => minimatch(itemPath, ignore, { matchBase: true }));
    return !isIgnored;
  }

  private _sigterm = () => this.stop(true);

  private _addJob(filePaths: BettererFilePaths = []): void {
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push(normalisedPaths);
  }

  private async _processQueue(): Promise<void> {
    // It's possible for the queue debounce to trigger *after* `this.stop()` has been called:
    if (this._isStopped) {
      this._jobs = [];
      return;
    }

    try {
      await this._running;
    } catch {
      // Error would be handled in `queue()`
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

      this._running = this._context.run(runPaths, this._isRunOnce);
      await this._running;
    }
  }

  private async _restart(optionsOverride: BettererOptionsOverride): Promise<void> {
    if (optionsOverride.reporters) {
      const { reporter } = getGlobals();

      const reporterΩ = reporter;
      // Don't await here! A custom reporter could be awaiting
      // the lifecycle promise which is unresolved right now!
      this._reporterContextStart = reporterΩ.contextStart(this, this.lifecycle.promise);
    }

    if (optionsOverride.filters) {
      // Wait for any pending run to finish, and any existing reporter to render:
      let lastSuiteΩ: BettererSuiteΩ | null = null;
      try {
        const lastSuite = this._context.lastSuite;
        lastSuiteΩ = lastSuite as BettererSuiteΩ;
        try {
          // This might throw or reject, but we want to rerun either way:
          await lastSuiteΩ.lifecycle.promise;
        } finally {
          void this._context.run(lastSuite.filePaths);
        }
      } catch {
        // It's okay if there's not a pending suite!
      }
    }
  }
}
