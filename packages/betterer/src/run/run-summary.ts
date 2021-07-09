import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererDelta } from '../context';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { BettererRunStatus, BettererRunΩ } from './run';
import { BettererRunSummary } from './types';

export class BettererRunSummaryΩ implements BettererRunSummary {
  public readonly expected = this._runΩ.expected;
  public readonly filePaths = this._runΩ.filePaths;
  public readonly isNew = this.expected.isNew;
  public readonly name = this._runΩ.name;
  public readonly timestamp = this._runΩ.timestamp;

  private _isPrinted = false;
  private _printed: string | null = null;

  constructor(
    private _runΩ: BettererRunΩ,
    private _test: BettererTestConfig,
    private _result: BettererResult | null,
    private _diff: BettererDiff | null,
    public readonly delta: BettererDelta | null,
    private _error: BettererError | null,
    private _status: BettererRunStatus,
    public readonly isComplete: boolean
  ) {}

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get error(): BettererError {
    assert(this._error);
    return this._error;
  }

  public get printed(): string | null {
    assert(this._isPrinted);
    return this._printed;
  }

  public get result(): BettererResult {
    assert(this._result);
    return this._result;
  }

  public get isBetter(): boolean {
    return this._status === BettererRunStatus.better;
  }

  public get isExpired(): boolean {
    return this.timestamp >= this._test.deadline;
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

  public async serialise(resultsPath: string): Promise<void> {
    const { isComplete, isNew, isSkipped, isFailed } = this;
    const shouldPrint = !(isComplete || (isNew && (isSkipped || isFailed)));
    if (shouldPrint) {
      const { isFailed, isSkipped, isWorse } = this;
      const toPrint = isFailed || isSkipped || isWorse ? this.expected : this.result;
      const serialised = this._test.serialiser.serialise(toPrint.value, resultsPath);
      this._printed = await this._test.printer(serialised);
    }
    this._isPrinted = true;
  }
}
