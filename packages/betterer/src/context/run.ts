import { BettererFilePaths } from '../betterer';
import { BettererTest } from './test';

export class BettererRun {
  private _expected: unknown;
  private _hasCompleted = false;
  private _isNew = false;
  private _result: unknown;

  constructor(private _test: BettererTest, private _files: BettererFilePaths) {
    this._expected = this._getExpected();
  }

  public get expected(): unknown {
    return this._expected;
  }

  public get files(): BettererFilePaths {
    return this._files;
  }

  public get hasCompleted(): boolean {
    return this._hasCompleted;
  }

  public get isNew(): boolean {
    return this._isNew;
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
    if (goalComplete) {
      this.completed();
    }
    this._result = result;
    this._test.context.runBetter(this);
  }

  public completed(): void {
    this._hasCompleted = true;
  }

  public end(): void {
    this._test.context.runEnd(this);
  }

  public failed(): void {
    this._result = this._expected;
    this._test.context.runFailed(this);
  }

  public new(result: unknown, goalComplete: boolean): void {
    if (goalComplete) {
      this.completed();
    }
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
    if (goalComplete) {
      this.completed();
    }
    this._result = this._expected;
    this._test.context.runSame(this);
  }

  public skipped(): void {
    this._test.context.runSkipped(this);
  }

  public worse(result: unknown): void {
    this._result = this._expected;
    this._test.context.runWorse(this, result, this.expected);
  }

  private _getExpected(): unknown {
    if (this.test.hasExpected) {
      return this.test.betterer.getExpected(this);
    }
    this._isNew = true;
    return;
  }
}
