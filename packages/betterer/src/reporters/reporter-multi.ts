import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererReporter } from './types';

export class BettererMultiReporterΩ implements BettererReporter {
  constructor(private _reporters: Array<BettererReporter>) {}

  async contextStart(context: BettererContext): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextStart?.(context)));
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
  async runStart(run: BettererRun): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runStart?.(run)));
  }
  async runEnd(run: BettererRun): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runEnd?.(run)));
  }
  async runError(run: BettererRun, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runError?.(run, error)));
  }
}
