import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererOptionsOverride, overrideConfig } from '../config';
import { BettererFilePaths, BettererVersionControlWorker } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsFileΩ } from '../results';
import { BettererRunWorkerPoolΩ, BettererRunΩ, createWorkerConfig } from '../run';
import { BettererSuiteΩ, BettererSuiteSummariesΩ, BettererSuiteSummaryΩ } from '../suite';
import { loadTestMeta } from '../test';
import { defer } from '../utils';
import { BettererGlobals } from '../types';
import { BettererContextSummaryΩ } from './context-summary';
import { BettererContext, BettererContextStarted, BettererContextSummary } from './types';

export class BettererContextΩ implements BettererContext {
  public readonly config: BettererConfig;
  public reporter: BettererReporterΩ;
  public readonly resultsFile: BettererResultsFileΩ;
  public readonly versionControl: BettererVersionControlWorker;

  private _suiteSummaries: BettererSuiteSummariesΩ = [];

  constructor(private _globals: BettererGlobals, private _runWorkerPool: BettererRunWorkerPoolΩ) {
    this.config = this._globals.config;
    this.reporter = this.config.reporter as BettererReporterΩ;
    this.resultsFile = this._globals.resultsFile;
    this.versionControl = this._globals.versionControl;
  }

  public options(optionsOverride: BettererOptionsOverride): void {
    overrideConfig(this.config, optionsOverride);
  }

  public start(): BettererContextStarted {
    const contextLifecycle = defer<BettererContextSummary>();

    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = this.reporter.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<BettererContextSummary> => {
        const contextSummary = new BettererContextSummaryΩ(this.config, this._suiteSummaries);
        contextLifecycle.resolve(contextSummary);
        await reportContextStart;
        await this.reporter.contextEnd(contextSummary);

        const suiteSummaryΩ = contextSummary.lastSuite;
        if (!this.config.ci) {
          await this.resultsFile.write(suiteSummaryΩ, this.config.precommit);
        }

        return contextSummary;
      },
      error: async (error: BettererError): Promise<void> => {
        contextLifecycle.reject(error);
        await reportContextStart;
        await this.reporter.contextError(this, error);
      }
    };
  }

  public async run(filePaths: BettererFilePaths): Promise<BettererSuiteSummaryΩ> {
    await this.resultsFile.sync();
    await this.versionControl.sync();

    filePaths = await this.versionControl.filterIgnored(filePaths);

    const testMeta = loadTestMeta(this.config);
    const testNames = Object.keys(testMeta);

    const workerConfig = createWorkerConfig(this.config);

    const runs = await Promise.all(
      testNames.map(async (testName) => {
        return BettererRunΩ.create(this._runWorkerPool, testName, workerConfig, filePaths, this.versionControl);
      })
    );

    const suite = new BettererSuiteΩ(this, filePaths, runs);
    const suiteSummary = await suite.run();
    this._suiteSummaries = [...this._suiteSummaries, suiteSummary];
    return suiteSummary;
  }
}
