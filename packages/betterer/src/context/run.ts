import { BettererContext } from './context';
import { Betterer } from '../betterer';

export class BettererRunContext {
  private _expected: unknown;
  private _hasExpected = false;
  private _hasCompleted = false;

  public static create(
    name: string,
    context: BettererContext,
    betterer: Betterer
  ): BettererRunContext {
    const run = new BettererRunContext(name, context, betterer);
    if (Object.hasOwnProperty.call(context.expected, name)) {
      run._expected = context.expected[name];
      run._hasExpected = true;
    }
    return run;
  }

  constructor(
    public readonly name: string,
    public readonly context: BettererContext,
    public readonly betterer: Betterer
  ) {}

  public get expected(): unknown {
    return this._expected;
  }

  public get hasCompleted(): boolean {
    return this._hasCompleted;
  }

  public get hasExpected(): boolean {
    return this._hasExpected;
  }

  public better(result: unknown, goalComplete: boolean): void {
    this.context.runBetter(this, result);
    if (goalComplete) {
      this.completed();
    }
  }

  public completed(): void {
    this._hasCompleted = true;
  }

  public end(): void {
    this.context.runEnd(this);
  }

  public failed(): void {
    this.context.runFailed(this);
  }

  public new(result: unknown, goalComplete: boolean): void {
    this.context.runNew(this, result);
    if (goalComplete) {
      this.completed();
    }
  }

  public ran(): void {
    this.context.runRan(this);
  }

  public start(): void {
    this.context.runStart(this);
  }

  public same(goalComplete: boolean): void {
    this.context.runSame(this);
    if (goalComplete) {
      this.completed();
    }
  }

  public skipped(): void {
    this.context.runSkipped(this);
  }

  public worse(result: unknown, serialised: unknown): void {
    this.context.runWorse(this, result, serialised, this.expected);
  }
}
