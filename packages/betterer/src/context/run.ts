import * as assert from 'assert';

import { BettererExpectedResult, NO_PREVIOUS_RESULT, deserialise, diff } from '../results';
import { BettererTest } from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererContextΩ } from './context';
import { BettererRun } from './types';

enum BettererRunStatus {
  better,
  failed,
  pending,
  neww,
  same,
  skipped,
  update,
  worse
}

export class BettererRunΩ implements BettererRun {
  private _result: unknown;
  private _toPrint: unknown;
  private _status: BettererRunStatus = BettererRunStatus.pending;

  private _expected: unknown;
  private _timestamp: number | null = null;

  private _isComplete = false;
  private _isExpired = false;
  private _isNew = true;
  private _hasResult = false;

  constructor(
    private readonly _context: BettererContextΩ,
    private readonly _test: BettererTest,
    expected: BettererExpectedResult | typeof NO_PREVIOUS_RESULT,
    private readonly _files: BettererFilePaths
  ) {
    if (expected === NO_PREVIOUS_RESULT) {
      this._expected = NO_PREVIOUS_RESULT;
      return;
    } else {
      this._isNew = false;
      this._expected = deserialise(this, expected.value);
      this._toPrint = this._expected;
      this._hasResult = true;
    }
  }

  public get expected(): unknown | typeof NO_PREVIOUS_RESULT {
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

  public get timestamp(): number {
    assert.notStrictEqual(this._status, BettererRunStatus.pending);
    assert.notStrictEqual(this._timestamp, null);
    return this._timestamp as number;
  }

  public get isBetter(): boolean {
    return this._status === BettererRunStatus.better;
  }

  public get isComplete(): boolean {
    return this._isComplete;
  }

  public get isExpired(): boolean {
    return this._isExpired;
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

  public get isSkipped(): boolean {
    return this._status === BettererRunStatus.skipped;
  }

  public get isUpdated(): boolean {
    return this._status === BettererRunStatus.update;
  }

  public get isWorse(): boolean {
    return this._status === BettererRunStatus.worse;
  }

  public get result(): unknown {
    return this._result;
  }

  public get context(): BettererContextΩ {
    return this._context;
  }

  public get test(): BettererTest {
    return this._test;
  }

  public better(result: unknown, isComplete: boolean): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.better;
    this._isComplete = isComplete;
    this._result = result;
    this._toPrint = result;
    this._hasResult = true;
    this._context.runBetter(this);
  }

  public end(): void {
    this._context.runEnd(this);
  }

  public failed(): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.failed;
    this._context.runFailed(this);
  }

  public neww(result: unknown, isComplete: boolean): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.neww;
    this._isComplete = isComplete;
    this._result = result;
    this._toPrint = result;
    this._hasResult = true;
    this._context.runNew(this);
  }

  public ran(): void {
    this._context.runRan(this);
  }

  public start(): void {
    const startTime = Date.now();
    this._isExpired = startTime > this._test.deadline;
    this._context.runStart(this);
    this._timestamp = startTime;
  }

  public same(result: unknown): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.same;
    this._result = result;
    this._toPrint = result;
    this._hasResult = true;
    this._context.runSame(this);
  }

  public skipped(): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.skipped;
    if (this._expected !== NO_PREVIOUS_RESULT) {
      this._result = this._expected;
      this._toPrint = this._expected;
      this._hasResult = true;
    }
    this._context.runSkipped(this);
  }

  public update(result: unknown): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.update;
    this._result = result;
    this._toPrint = result;
    this._hasResult = true;
    this._context.runUpdate(this);
  }

  public worse(result: unknown): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.worse;
    this._result = result;
    this._toPrint = this._expected;
    this._hasResult = true;
    this._context.runWorse(this);
  }

  public diff(): void {
    diff(this);
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
