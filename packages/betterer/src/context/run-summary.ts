import assert from 'assert';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { BettererRunStatus } from './run';
import { BettererDelta, BettererRunSummary } from './types';

export class BettererRunSummaryΩ implements BettererRunSummary {
  constructor(
    public readonly lifecycle: Promise<BettererRunSummary>,
    public readonly test: BettererTestConfig,
    public readonly name: string,
    public readonly filePaths: BettererFilePaths,
    public readonly expected: BettererResult,
    public readonly timestamp: number,
    public readonly isComplete: boolean,
    private _result: BettererResult | null,
    private _diff: BettererDiff | null,
    private _delta: BettererDelta | null,
    private _status: BettererRunStatus
  ) {}

  public get delta(): BettererDelta {
    assert(this._delta);
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
