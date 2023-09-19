import type { BettererError } from '@betterer/errors';
import type { FSWatcher } from 'chokidar';

import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererResultsFileΩ } from '../results/index.js';
import type { BettererSuiteSummaries, BettererSuiteSummary } from '../suite/index.js';
import type { BettererGlobals } from '../types.js';
import type { BettererContext, BettererContextStarted, BettererContextSummary } from './types.js';

import { overrideConfig } from '../config/index.js';
import { BettererFileResolverΩ } from '../fs/index.js';
import { BettererRunWorkerPoolΩ, BettererRunΩ, createWorkerRunConfig } from '../run/index.js';
import { BettererSuiteΩ } from '../suite/index.js';
import { defer } from '../utils.js';
import { importWorker } from '../worker/index.js';
import { BettererContextSummaryΩ } from './context-summary.js';

export class BettererContextΩ implements BettererContext {
  public readonly config: BettererConfig;

  private _isDestroyed = false;
  private _reporter: BettererReporterΩ;
  private _started: BettererContextStarted;
  private _suiteSummaries: BettererSuiteSummaries = [];

  private readonly _resultsFile: BettererResultsFileΩ;
  private readonly _runWorkerPool: BettererRunWorkerPoolΩ;
  private readonly _testMetaLoader = importWorker<typeof import('./context.worker.js')>('./context.worker.js');
  private readonly _versionControl: BettererVersionControlWorker;

  constructor(private _globals: BettererGlobals, private readonly _watcher: FSWatcher | null) {
    this.config = this._globals.config;

    this._runWorkerPool = new BettererRunWorkerPoolΩ(this.config.workers);
    this._resultsFile = this._globals.resultsFile;
    this._reporter = this.config.reporter as BettererReporterΩ;
    this._versionControl = this._globals.versionControl;

    this._started = this._start();
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    // Wait for any pending run to finish, and any existing reporter to render:
    await this._started.end();
    // Override the config:
    overrideConfig(this.config, optionsOverride);
    // Start everything again, and trigger a new reporter:
    this._started = this._start();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
    process.on('SIGTERM', () => this.stop());
  }

  public async run(specifiedFilePaths: BettererFilePaths, isRunOnce = false): Promise<void> {
    try {
      await this._resultsFile.sync();
      await this._versionControl.sync();

      const { cwd, includes, excludes } = this.config;

      const globalResolver = new BettererFileResolverΩ(cwd, this._versionControl);
      globalResolver.include(...includes);
      globalResolver.exclude(...excludes);

      const hasSpecifiedFiles = specifiedFilePaths.length > 0;
      const hasGlobalIncludesExcludes = includes.length || excludes.length;

      let filePaths: BettererFilePaths;
      if (hasSpecifiedFiles && hasGlobalIncludesExcludes) {
        // Validate specified files based on global `includes`/`excludes and gitignore rules:
        filePaths = await globalResolver.validate(specifiedFilePaths);
      } else if (hasSpecifiedFiles) {
        // Validate specified files based on gitignore rules:
        filePaths = await globalResolver.validate(specifiedFilePaths);
      } else if (hasGlobalIncludesExcludes) {
        // Resolve files based on global `includes`/`excludes and gitignore rules:
        filePaths = await globalResolver.files();
      } else {
        // When `filePaths` is `[]` the test will use its specific resolver:
        filePaths = [];
      }

      // Load test names in a worker so the import cache is always clean:
      const testNames = await this._testMetaLoader.api.loadTestNames(this.config.tsconfigPath, this.config.configPaths);

      const workerRunConfig = createWorkerRunConfig(this.config);

      const runs = await Promise.all(
        testNames.map(async (testName) => {
          return await BettererRunΩ.create(
            this._runWorkerPool,
            testName,
            workerRunConfig,
            filePaths,
            this._versionControl
          );
        })
      );

      const suite = new BettererSuiteΩ(this.config, this._resultsFile, filePaths, runs);
      const suiteSummary = await suite.run(isRunOnce);
      this._suiteSummaries = [...this._suiteSummaries, suiteSummary];
    } catch (error) {
      await this._started.error(error as BettererError);
      throw error;
    }
  }

  public async runOnce(): Promise<BettererSuiteSummary> {
    try {
      await this.run([], true);
      const summary = await this.stop();
      return summary;
    } finally {
      await this._destroy();
    }
  }

  public async stop(): Promise<BettererSuiteSummary> {
    try {
      const contextSummary = await this._started.end();
      return contextSummary.lastSuite;
    } finally {
      await this._destroy();
    }
  }

  private async _destroy(): Promise<void> {
    if (this._isDestroyed) {
      return;
    }
    this._isDestroyed = true;
    if (this._watcher) {
      await this._watcher.close();
    }
    await this._testMetaLoader.destroy();
    await this._versionControl.destroy();
    await this._runWorkerPool.destroy();
  }

  private _start(): BettererContextStarted {
    // Update `this._reporterΩ` here because `this.options()` may have been called:
    this._reporter = this.config.reporter as BettererReporterΩ;
    const reporterΩ = this._reporter;

    const contextLifecycle = defer<BettererContextSummary>();

    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = reporterΩ.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<BettererContextSummary> => {
        const contextSummary = new BettererContextSummaryΩ(this.config, this._suiteSummaries);
        contextLifecycle.resolve(contextSummary);
        await reportContextStart;
        await reporterΩ.contextEnd(contextSummary);

        const suiteSummaryΩ = contextSummary.lastSuite;
        if (suiteSummaryΩ && !this.config.ci) {
          await this._resultsFile.write(suiteSummaryΩ, this.config.precommit);
        }
        await this._versionControl.writeCache();

        return contextSummary;
      },
      error: async (error: BettererError): Promise<void> => {
        contextLifecycle.reject(error);
        await reportContextStart;
        await reporterΩ.contextError(this, error);
      }
    };
  }
}
