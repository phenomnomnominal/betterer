import assert from 'assert';

import { BettererDiff } from '../test';
import { BettererResult } from '../results';
import { BettererRunStatus, BettererRunΩ } from './run';
import { BettererDelta, BettererRunSummary } from './types';

export class BettererRunSummaryΩ implements BettererRunSummary {
  public readonly name = this._runΩ.name;
  public readonly filePaths = this._runΩ.filePaths;
  public readonly expected = this._runΩ.expected;
  public readonly timestamp = this._runΩ.timestamp;
  public readonly test = this._runΩ.test;

  constructor(
    private _runΩ: BettererRunΩ,
    private _result: BettererResult | null,
    private _diff: BettererDiff | null,
    private _delta: BettererDelta | null,
    private _status: BettererRunStatus,
    public readonly isComplete: boolean
  ) {}

  public get delta(): BettererDelta | null {
    return this._delta;
  }

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get result(): BettererResult {
    assert(this._result);
    return this._result;
  }

  public get isBetter(): boolean {
    return this._status === BettererRunStatus.better;
  }

  public get isExpired(): boolean {
    return this.timestamp >= this.test.deadline;
  }

  public get isFailed(): boolean {
    return this._status === BettererRunStatus.failed;
  }

  public get isNew(): boolean {
    return this.expected.isNew;
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
