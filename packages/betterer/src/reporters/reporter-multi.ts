import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererStats } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererReporter } from './types';

export class BettererMultiReporter implements BettererReporter {
  constructor(private _reporters: Array<BettererReporter>) {}

  contextStart(context: BettererContext): void {
    this._reporters.forEach((r) => r.contextStart?.(context));
  }
  contextEnd(context: BettererContext, stats: BettererStats): void {
    this._reporters.forEach((r) => r.contextEnd?.(context, stats));
  }
  contextError(context: BettererContext, error: BettererError, printed: Array<string>): void {
    this._reporters.forEach((r) => r.contextError?.(context, error, printed));
  }
  runsStart(runs: BettererRuns, files: BettererFilePaths): void {
    this._reporters.forEach((r) => r.runsStart?.(runs, files));
  }
  runsEnd(runs: BettererRuns, files: BettererFilePaths): void {
    this._reporters.forEach((r) => r.runsEnd?.(runs, files));
  }
  runStart(run: BettererRun): void {
    this._reporters.forEach((r) => r.runStart?.(run));
  }
  runEnd(run: BettererRun): void {
    this._reporters.forEach((r) => r.runEnd?.(run));
  }
}
