import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererFilePaths, BettererVersionControlWorker } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ } from '../results';
import { defer } from '../utils';
import { BettererSuiteSummaryΩ, BettererSuiteSummary, BettererSuiteSummaries, BettererSuiteΩ } from '../suite';
import { BettererContext, BettererContextStarted, BettererContextSummary } from './types';
import { BettererGlobals } from '../types';
import { BettererContextSummaryΩ } from './context-summary';

export class BettererContextΩ implements BettererContext, BettererGlobals {
  public readonly config: BettererConfig;
  public readonly reporter: BettererReporterΩ;
  public readonly results: BettererResultsΩ;
  public readonly versionControl: BettererVersionControlWorker;

  private _suiteSummaries: BettererSuiteSummaries = [];

  constructor(private _globals: BettererGlobals) {
    this.config = this._globals.config;
    this.reporter = this._globals.reporter;
    this.results = this._globals.results;
    this.versionControl = this._globals.versionControl;
  }

  public start(): BettererContextStarted {
    const contextLifecycle = defer<BettererContextSummary>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = this.reporter.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<BettererContextSummary> => {
        const contextSummary = new BettererContextSummaryΩ(this._globals, this._suiteSummaries);
        contextLifecycle.resolve(contextSummary);
        await reportContextStart;
        await this.reporter.contextEnd(contextSummary);

        await this.versionControl.writeCache();

        const suiteSummaryΩ = contextSummary.lastSuite as BettererSuiteSummaryΩ;
        if (suiteSummaryΩ.shouldWrite) {
          await this.results.write(suiteSummaryΩ.result);
          if (this.config.precommit) {
            await this.versionControl.add(this.config.resultsPath);
          }
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

  public async run(filePaths: BettererFilePaths): Promise<BettererSuiteSummary> {
    await this.results.sync();
    await this.versionControl.sync();

    const validFilePaths = await this.versionControl.filterIgnored(filePaths);

    const suite = new BettererSuiteΩ(this, validFilePaths);
    const suiteSummary = await suite.run();
    this._suiteSummaries.push(suiteSummary);
    return suiteSummary;
  }
}
