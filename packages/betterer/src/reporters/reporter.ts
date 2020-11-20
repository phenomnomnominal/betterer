import { BettererError } from '@betterer/errors';

import { BettererConfigPartial } from '../config';
import { BettererContext, BettererRun, BettererRuns, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererReporter } from './types';

export class BettererReporterΩ implements BettererReporter {
  constructor(private _reporters: Array<BettererReporter>) {}

  async configError(partialConfig: BettererConfigPartial, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.configError?.(partialConfig, error)));
  }
  async contextStart(context: BettererContext, lifecycle: Promise<BettererSummary>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextStart?.(context, lifecycle)));
  }
  async contextEnd(context: BettererContext, summary: BettererSummary): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextEnd?.(context, summary)));
  }
  async contextError(context: BettererContext, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextError?.(context, error)));
  }
  async runsStart(runs: BettererRuns, files: BettererFilePaths): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runsStart?.(runs, files)));
  }
  async runsEnd(runs: BettererRuns, files: BettererFilePaths): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runsEnd?.(runs, files)));
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
