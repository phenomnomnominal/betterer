import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererFilePaths, BettererVersionControlWorker } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ } from '../results';
import { Defer, defer } from '../utils';
import {
  createRuns,
  BettererRuns,
  BettererRunSummaries,
  BettererRunSummary,
  BettererRunΩ,
  BettererReporterRun,
  BettererWorkerPoolΩ
} from '../run';
import { BettererSummaryΩ } from './summary';
import { BettererContext, BettererContextStarted, BettererSummaries, BettererSummary } from './types';
import { BettererGlobals } from '../types';

export class BettererContextΩ implements BettererContext, BettererGlobals {
  public readonly config: BettererConfig;
  public readonly reporter: BettererReporterΩ;
  public readonly results: BettererResultsΩ;
  public readonly versionControl: BettererVersionControlWorker;
  public readonly workerPool: BettererWorkerPoolΩ;

  private _running: Promise<BettererRunSummaries> | null = null;
  private _summaries: BettererSummaries = [];

  constructor(globals: BettererGlobals) {
    this.config = globals.config;
    this.reporter = globals.reporter;
    this.results = globals.results;
    this.versionControl = globals.versionControl;
    this.workerPool = globals.workerPool;
  }

  public start(): BettererContextStarted {
    const contextLifecycle = defer<BettererSummaries>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = this.reporter.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<void> => {
        contextLifecycle.resolve(this._summaries);
        await reportContextStart;
        await this.reporter.contextEnd(this, this._summaries);
        const summaryΩ = this._summaries[this._summaries.length - 1] as BettererSummaryΩ;
        if (summaryΩ.shouldWrite) {
          await this.results.write(summaryΩ.result);
          await this.versionControl.writeCache();
          if (this.config.precommit) {
            await this.versionControl.add(this.config.resultsPath);
          }
        }
        await this.workerPool.close();
      },
      error: async (error: BettererError): Promise<void> => {
        contextLifecycle.reject(error);
        await reportContextStart;
        await this.reporter.contextError(this, error);
        await this.workerPool.close();
      }
    };
  }

  public async run(filePaths: BettererFilePaths): Promise<BettererSummary> {
    if (this._running) {
      await this._running;
    }
    await this.results.sync();
    await this.versionControl.sync();

    const validFilePaths = await this.versionControl.filterIgnored(filePaths);
    const runs = createRuns(this.workerPool, this.results, this.config, validFilePaths);

    // Attach lifecycle promises for Reporters:
    const runLifecycles = runs.map((run) => {
      const lifecycle = defer<BettererRunSummary>();
      (run as BettererReporterRun).lifecycle = lifecycle.promise;
      return lifecycle;
    });

    const runsLifecycle = defer<BettererSummary>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportRunsStart = this.reporter.runsStart(runs, validFilePaths, runsLifecycle.promise);
    try {
      this._running = this._runRuns(runs, runLifecycles);
      const runSummaries = await this._running;
      const result = await this.results.print(runSummaries);
      const expected = await this.results.read();
      const summary = new BettererSummaryΩ(runSummaries, result, expected, this.config.ci);
      this._summaries.push(summary);
      runsLifecycle.resolve(summary);
      await reportRunsStart;
      await this.reporter.runsEnd(summary, validFilePaths);
      return summary;
    } catch (error) {
      runsLifecycle.reject(error);
      await reportRunsStart;
      await this.reporter.runsError(runs, validFilePaths, error);
      throw error;
    }
  }

  private async _runRuns(
    runs: BettererRuns,
    runLifecycles: Array<Defer<BettererRunSummary>>
  ): Promise<BettererRunSummaries> {
    return Promise.all(
      runs.map(async (run, index) => {
        const lifecycle = runLifecycles[index];
        const runΩ = run as BettererRunΩ;
        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = this.reporter.runStart(runΩ, lifecycle.promise);
        const runSummary = await runΩ.run(this.config);
        if (runSummary.isFailed) {
          const { error } = runSummary;
          lifecycle.reject(error);
          await reportRunStart;
          await this.reporter.runError(runΩ, error);
        } else {
          lifecycle.resolve(runSummary);
          await reportRunStart;
          await this.reporter.runEnd(runSummary);
        }
        return runSummary;
      })
    );
  }
}
