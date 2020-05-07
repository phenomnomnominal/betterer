import { BettererExpectedResult, NO_PREVIOUS_RESULT, deserialise } from '../results';
import { BettererTest } from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererContext } from './context';

enum BettererRunStatus {
  better = 'better',
  complete = 'complete',
  failed = 'failed',
  pending = 'pending',
  neww = 'new',
  same = 'same',
  skipped = 'skipped',
  worse = 'worse'
}

export class BettererRun {
  private _result: unknown;
  private _toPrint: unknown;
  private _status: BettererRunStatus = BettererRunStatus.pending;

  private _expected: unknown;
  private _timestamp: number | null = null;

  private _isNew = true;
  private _hasResult = false;

  constructor(
    private readonly _context: BettererContext,
    private readonly _test: BettererTest,
    expected: BettererExpectedResult,
    private readonly _files: BettererFilePaths
  ) {
    if (expected === NO_PREVIOUS_RESULT) {
      return;
    } else {
      this._isNew = false;
      this._hasResult = true;
      this._expected = this._test.getExpected(deserialise(this._test, expected.value), this._files);
      this._toPrint = this._expected;
      this._timestamp = expected.timestamp;
    }
  }

  public get expected(): unknown {
    return this._expected;
  }

  public get files(): BettererFilePaths {
    return this._files;
  }

  public get shouldPrint(): boolean {
    return !this.isComplete && this._hasResult;
  }

  public get toPrint(): unknown {
    return this._toPrint;
  }

  public get status(): string {
    return this._status;
  }

  public get timestamp(): number {
    if (this._timestamp === null) {
      throw new Error();
    }
    return this._timestamp;
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

  public get context(): BettererContext {
    return this._context;
  }

  public get test(): BettererTest {
    return this._test;
  }

  public better(result: unknown, isComplete: boolean, timestamp: number): void {
    this._status = isComplete ? BettererRunStatus.complete : BettererRunStatus.better;
    this._hasResult = true;
    this._result = result;
    this._toPrint = result;
    this._timestamp = timestamp;
    this._context.runBetter(this);
  }

  public end(): void {
    this._context.runEnd(this);
  }

  public failed(): void {
    this._status = BettererRunStatus.failed;
    this._context.runFailed(this);
  }

  public neww(result: unknown, isComplete: boolean, timestamp: number): void {
    this._status = isComplete ? BettererRunStatus.complete : BettererRunStatus.neww;
    this._hasResult = true;
    this._result = result;
    this._toPrint = result;
    this._timestamp = timestamp;
    this._context.runNew(this);
  }

  public ran(): void {
    this._context.runRan(this);
  }

  public start(): void {
    this._context.runStart(this);
  }

  public same(isComplete: boolean): void {
    this._status = isComplete ? BettererRunStatus.complete : BettererRunStatus.same;
    this._hasResult = true;
    this._toPrint = this._expected;
    this._context.runSame(this);
  }

  public skipped(): void {
    this._status = BettererRunStatus.skipped;
    this._hasResult = true;
    this._toPrint = this._expected;
    this._context.runSkipped(this);
  }

  public worse(result: unknown): void {
    this._status = BettererRunStatus.worse;
    this._hasResult = true;
    this._result = result;
    this._toPrint = this._expected;
    this._context.runWorse(this);
  }
}
