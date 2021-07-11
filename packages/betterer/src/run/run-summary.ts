import assert from 'assert';

import { BettererDiff } from '../test';
import { BettererResultΩ } from '../results';
import { BettererRunSummary } from './types';
import { BettererDelta } from '../context';
import { BettererError } from '@betterer/errors';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

export enum BettererRunStatus {
  better,
  failed,
  new,
  same,
  skipped,
  update,
  worse
}

export class BettererRunSummaryΩ implements BettererRunSummary {
  public readonly baseline: BettererResultΩ;
  public readonly expected: BettererResultΩ;
  public readonly result: BettererResultΩ;
  public readonly filePaths = this._summaryΩ.filePaths;
  public readonly isComplete = this._summaryΩ.isComplete;
  public readonly isExpired = this._summaryΩ.isExpired;
  public readonly isNew = this._summaryΩ.isNew;
  public readonly name = this._summaryΩ.name;
  public readonly printed = this._summaryΩ.printed;
  public readonly timestamp = this._summaryΩ.timestamp;

  private _delta = this._summaryΩ.delta;
  private _diff = this._summaryΩ.diff;
  private _error = this._summaryΩ.error;
  private _status = this._summaryΩ.status;

  constructor(private _summaryΩ: BettererWorkerRunSummaryΩ) {
    this.baseline = new BettererResultΩ(this._summaryΩ.baseline);
    this.expected = new BettererResultΩ(this._summaryΩ.expected);
    this.result = new BettererResultΩ(this._summaryΩ.result);
  }

  public get delta(): BettererDelta | null {
    return this._delta;
  }

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get error(): BettererError {
    assert(this._error);
    return this._error;
  }

  public get isBetter(): boolean {
    return this._status === BettererRunStatus.better;
  }

  public get isFailed(): boolean {
    return this._status === BettererRunStatus.failed;
  }

  public get isSame(): boolean {
    return this._status === BettererRunStatus.same;
  }

  public get isSkipped(): boolean {
    return this._status === BettererRunStatus.skipped;
  }

  public get isUpdated(): boolean {
    return this._status === BettererRunStatus.update;
  }

  public get isWorse(): boolean {
    return this._status === BettererRunStatus.worse;
  }
}
