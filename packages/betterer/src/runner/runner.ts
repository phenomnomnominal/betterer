import type { FSWatcher } from 'chokidar';
import type { BettererOptions } from '../api/index.js';
import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererContextSummary } from '../context/index.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererSuiteSummary, BettererSuiteSummaryΩ } from '../suite/index.js';
import type { BettererOptionsWatcher, BettererRunner } from './types.js';

import { BettererError } from '@betterer/errors';

import { BettererContextΩ } from '../context/index.js';
import { createGlobals, destroyGlobals, getGlobals } from '../globals.js';
import { normalisedPath } from '../utils.js';
import { createWatcher, WATCHER_EVENTS } from './watcher.js';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  public config: BettererConfig;
  public readonly lifecycle = Promise.withResolvers<BettererContextSummary>();

  private _reporterContextStart: Promise<void>;
  private _isRunOnce = false;
  private _isStopped = false;
  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<BettererSuiteSummary> | null = null;
  private _sigterm = this.stop.bind(this);

  private constructor(
    private readonly _context: BettererContextΩ,
    private readonly _watcher: FSWatcher | null
  ) {
    const { config, reporter } = getGlobals();
    const reporterΩ = reporter as BettererReporterΩ;

    this.config = config;

    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    this._reporterContextStart = reporterΩ.contextStart(this, this.lifecycle.promise);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
    process.on('SIGTERM', this._sigterm);

    if (this._watcher) {
      this._watcher.on('all', (event: string, filePath: string) => {
        if (WATCHER_EVENTS.includes(event)) {
          void this.queue([filePath]);
        }
      });
    }
  }

  public static async create(
    options: BettererOptions,
    optionsWatch: BettererOptionsWatcher = {}
  ): Promise<BettererRunnerΩ> {
    await createGlobals(options, optionsWatch);
    const watcher = await createWatcher();
    const context = new BettererContextΩ();

    return new BettererRunnerΩ(context, watcher);
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    await this._context.options(optionsOverride);
  }

  public async run(): Promise<BettererContextSummary> {
    this._isRunOnce = true;
    await this.queue([]);
    return await this.stop();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    if (this._isStopped) {
      throw new BettererError('You cannot queue a test run after the runner has been stopped! 💥');
    }
    this._addJob(filePaths);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        void (async () => {
          try {
            await this._processQueue();
            resolve();
          } catch (error) {
            reject(error as BettererError);
          }
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(): Promise<BettererContextSummary>;
  public async stop(force: true): Promise<BettererContextSummary | null>;
  public async stop(force?: true): Promise<BettererContextSummary | null> {
    try {
      this._isStopped = true;
      if (!force) {
        await this._running;
      }
      if (this._watcher) {
        await this._watcher.close();
      }

      const contextSummary = await this._context.stop();

      // Lifecycle promise is resolved, so it's safe to await
      // the result of `reporter.contextStart`:
      this.lifecycle.resolve(contextSummary);
      await this._reporterContextStart;

      const { config, reporter, results, versionControl } = getGlobals();
      const reporterΩ = reporter as BettererReporterΩ;

      await reporterΩ.contextEnd(contextSummary);

      const suiteSummaryΩ = contextSummary.lastSuite as BettererSuiteSummaryΩ;
      if (!config.ci) {
        const didWrite = await results.api.write(suiteSummaryΩ.result);
        if (didWrite && config.precommit) {
          await versionControl.api.add(config.resultsPath);
        }
        await versionControl.api.writeCache();
      }

      return contextSummary;
    } catch (error) {
      if (force) {
        return null;
      }
      throw error;
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
      process.off('SIGTERM', this._sigterm);

      await destroyGlobals();
    }
  }

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

    if (this._jobs.length) {
      const filePaths = new Set<string>();
      this._jobs.forEach((job) => {
        job.forEach((path) => {
          filePaths.add(path);
        });
      });
      const runPaths = Array.from(filePaths).sort();
      this._jobs = [];

      const { versionControl } = getGlobals();

      await versionControl.api.sync();

      this._running = this._context.run(runPaths, this._isRunOnce);
      try {
        await this._running;
      } catch (error) {
        // Lifecycle promise is rejected, so it's safe to await
        // the result of `reporter.contextStart`:
        this.lifecycle.reject(error as BettererError);
        await this._reporterContextStart;

        const { reporter } = getGlobals();
        const reporterΩ = reporter as BettererReporterΩ;
        await reporterΩ.contextError(this, error as BettererError);
        throw error;
      }
    }
  }
}
