import { BettererFilePaths } from '../files';
import { BettererTest } from './test';

export class BettererRun {
  private _expected: unknown;
  private _hasExpected = false;
  private _hasCompleted = false;
  private _result: unknown;

  constructor(private _test: BettererTest, private _files: BettererFilePaths) {
    const { betterer, context, name } = this._test;
    if (Object.hasOwnProperty.call(context.expected, name)) {
      this._expected = betterer.getExpected(
        context.expected[name],
        this._files
      );
      this._hasExpected = true;
    }
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

  public get hasExpected(): boolean {
    return this._hasExpected;
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

  public worse(result: unknown, serialised: unknown): void {
    this._result = this._expected;
    this._test.context.runWorse(this, result, serialised, this.expected);
  }
}
