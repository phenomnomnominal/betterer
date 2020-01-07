import { BettererFilePaths } from '../betterer';
import { BettererTest } from './test';
import { BettererRunStatus } from './run-status';

export class BettererRun {
  private _expected: unknown;
  private _hasUpdated = false;
  private _isNew = false;
  private _result: unknown;
  private _status: BettererRunStatus = BettererRunStatus.pending;

  constructor(private _test: BettererTest, private _files: BettererFilePaths) {
    this._expected = this._getExpected();
  }

  // Hack:

  public get expected(): unknown {
    return this._expected;
  }

  public get files(): BettererFilePaths {
    return this._files;
  }

  public get hasResult(): boolean {
    // If you run a test for the first time and it is
    // skipped or it fails, then it doesn't have a result:
    return !(this.isNew && (this._status === BettererRunStatus.skipped || this._status === BettererRunStatus.failed));
  }

  public get hasUpdated(): boolean {
    return this._hasUpdated;
  }

  public get status(): string {
    return this._status;
  }

  public get isBetter(): boolean {
    return this._status === BettererRunStatus.better;
  }

  public get isComplete(): boolean {
    return this._status === BettererRunStatus.complete;
  }

  public get isFailed(): boolean {
    return this._status === BettererRunStatus.failed;
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public get isSame(): boolean {
    return this._status === BettererRunStatus.same;
  }

  public get isWorse(): boolean {
    return this._status === BettererRunStatus.worse;
  }

  public get name(): string {
    return this._test.name;
  }

  public get result(): unknown {
    return this._result;
  }

  public get test(): BettererTest {
    return this._test;
  }

  public better(result: unknown, goalComplete: boolean): void {
    this._status = goalComplete ? BettererRunStatus.complete : BettererRunStatus.better;
    this._hasUpdated = true;
    this._result = result;
    this._test.context.runBetter(this);
  }

  public end(): void {
    this._test.context.runEnd(this);
  }

  public failed(): void {
    this._status = BettererRunStatus.failed;
    this._test.context.runFailed(this);
  }

  public new(result: unknown, goalComplete: boolean): void {
    this._status = goalComplete ? BettererRunStatus.complete : BettererRunStatus.new;
    this._hasUpdated = true;
    this._result = result;
    this._test.context.runNew(this);
  }

  public ran(): void {
    this._test.context.runRan(this);
  }

  public start(): void {
    this._test.context.runStart(this);
  }

  public same(goalComplete: boolean): void {
    this._status = goalComplete ? BettererRunStatus.complete : BettererRunStatus.same;
    this._result = this._expected;
    this._test.context.runSame(this);
  }

  public skipped(): void {
    this._status = BettererRunStatus.skipped;
    this._test.context.runSkipped(this);
  }

  public worse(result: unknown): void {
    this._status = BettererRunStatus.worse;
    this._result = result;
    this._test.context.runWorse(this);
  }

  private _getExpected(): unknown {
    if (this.test.hasExpected) {
      return this.test.betterer.getExpected(this);
    }
    this._isNew = true;
    return;
  }
}
