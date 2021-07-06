import assert from 'assert';

import { BettererDiff } from '../test';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererRun, BettererRunSummary } from './types';
import { BettererDelta } from '../context';
import { BettererError } from '@betterer/errors';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

export enum BettererRunStatus {
  better,
  failed,
  pending,
  new,
  same,
  skipped,
  update,
  worse
}

export class BettererRunSummaryΩ implements BettererRunSummary {
  public readonly name = this._runΩ.name;
  public readonly filePaths = this._runΩ.filePaths;
  public readonly expected = this._runΩ.expected;
  public readonly timestamp = this._runΩ.timestamp;
  public readonly test = this._runΩ.test;
  public readonly status = this._summaryΩ.status;
  public readonly isComplete = this._summaryΩ.isComplete;

  private _delta = this._summaryΩ.delta;
  private _diff = this._summaryΩ.diff;
  private _error = this._summaryΩ.error;

  constructor(
    private _runΩ: BettererRun,
    private _summaryΩ: BettererWorkerRunSummaryΩ,
    private _result: BettererResultΩ
  ) {}

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

  public get result(): BettererResult {
    assert(this._result);
    return this._result;
  }

  public get isBetter(): boolean {
    return this.status === BettererRunStatus.better;
  }

  public get isExpired(): boolean {
    return this.timestamp >= this.test.deadline;
  }

  public get isFailed(): boolean {
    return this.status === BettererRunStatus.failed;
  }

  public get isNew(): boolean {
    return this.expected.isNew;
  }

  public get isSame(): boolean {
    return this.status === BettererRunStatus.same;
  }

  public get isSkipped(): boolean {
    return this.status === BettererRunStatus.skipped;
  }

  public get isUpdated(): boolean {
    return this.status === BettererRunStatus.update;
  }

  public get isWorse(): boolean {
    return this.status === BettererRunStatus.worse;
  }
}
