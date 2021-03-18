import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererSummary, BettererSummaries } from '../context';
import { BettererFilePaths } from '../runner';
import { BettererReporter } from './types';

export class BettererReporterΩ implements BettererReporter {
  constructor(private _reporters: Array<BettererReporter>) {}

  async configError(invalidConfig: unknown, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.configError?.(invalidConfig, error)));
  }
  async contextStart(context: BettererContext, lifecycle: Promise<BettererSummaries>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextStart?.(context, lifecycle)));
  }
  async contextEnd(context: BettererContext, summaries: BettererSummaries): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextEnd?.(context, summaries)));
  }
  async contextError(context: BettererContext, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextError?.(context, error)));
  }
  async runsStart(runs: BettererRuns, files: BettererFilePaths, lifecycle: Promise<BettererSummary>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runsStart?.(runs, files, lifecycle)));
  }
  async runsEnd(summary: BettererSummary, files: BettererFilePaths): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runsEnd?.(summary, files)));
  }
  async runsError(runs: BettererRuns, files: BettererFilePaths, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runsError?.(runs, files, error)));
  }
  async runStart(run: BettererRun, lifecycle: Promise<void>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runStart?.(run, lifecycle)));
  }
  async runEnd(run: BettererRun): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runEnd?.(run)));
  }
  async runError(run: BettererRun, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runError?.(run, error)));
  }
}
