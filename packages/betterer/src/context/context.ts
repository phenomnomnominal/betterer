import type { BettererError } from '@betterer/errors';

import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererResultsΩ } from '../results/index.js';
import type { BettererRunWorkerPool } from '../run/index.js';
import type { BettererSuiteSummaries, BettererSuiteSummary } from '../suite/index.js';
import type { BettererTestLoaderWorker } from '../test/index.js';
import type { BettererContext, BettererContextStarted, BettererContextSummary } from './types.js';

import { importWorker__ } from '@betterer/worker';

import { parse, write } from '../fs/index.js';
import { overrideReporterConfig } from '../reporters/index.js';
import { BettererRunΩ, createRunWorkerPool } from '../run/index.js';
import { overrideRunnerConfig, overrideWatchConfig } from '../runner/index.js';
import { BettererSuiteΩ } from '../suite/index.js';
import { defer } from '../utils.js';
import { BettererContextSummaryΩ } from './context-summary.js';

export class BettererContextΩ implements BettererContext {
  private _isDestroyed = false;
  private _reporter: BettererReporterΩ;
  private _started: BettererContextStarted;
  private _suiteSummaries: BettererSuiteSummaries = [];

  private readonly _runWorkerPool: BettererRunWorkerPool;
  private readonly _testMetaLoader: BettererTestLoaderWorker = importWorker__('../test/loader.worker.js');

  constructor(
    public readonly config: BettererConfig,
    private readonly _results: BettererResultsΩ,
    private readonly _versionControl: BettererVersionControlWorker
  ) {
    this._runWorkerPool = createRunWorkerPool(this.config.workers);
    this._reporter = this.config.reporter as BettererReporterΩ;

    this._started = this._start();
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    // Wait for any pending run to finish, and any existing reporter to render:
    await this._started.end();

    // Override the config:
    overrideReporterConfig(this.config, optionsOverride);
    overrideRunnerConfig(this.config, optionsOverride);
    overrideWatchConfig(this.config, optionsOverride);

    // Start everything again, and trigger a new reporter:
    this._started = this._start();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
    process.on('SIGTERM', () => this.stop());
  }

  public async run(filePaths: BettererFilePaths, isRunOnce = false): Promise<void> {
    try {
      const expected = await parse(this.config.resultsPath);
      this._results.sync(expected);

      // Load test names in a worker so the import cache is always clean:
      const testNames = await this._testMetaLoader.api.loadTestNames(this.config.tsconfigPath, this.config.configPaths);

      const runs = await Promise.all(
        testNames.map(async (testName) => {
          return await BettererRunΩ.create(this._runWorkerPool, testName, this.config, filePaths, this._versionControl);
        })
      );

      const suite = new BettererSuiteΩ(this.config, this._results, filePaths, runs);
      const suiteSummary = await suite.run(isRunOnce);
      this._suiteSummaries = [...this._suiteSummaries, suiteSummary];
    } catch (error) {
      await this._started.error(error as BettererError);

      if (isRunOnce) {
        await this._destroy();
      }

      throw error;
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
          const printedResult = this._results.printSummary(suiteSummaryΩ);
          if (printedResult) {
            await write(printedResult, this.config.resultsPath);
            if (this.config.precommit) {
              await this._versionControl.api.add(this.config.resultsPath);
            }
          }
        }
        await this._versionControl.api.writeCache();

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
