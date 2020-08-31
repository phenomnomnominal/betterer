import * as assert from 'assert';

import { BettererResultΩ, BettererDiff } from '../results';
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
  private _diff: BettererDiff | null = null;
  private _result: BettererResultΩ | null = null;
  private _status: BettererRunStatus = BettererRunStatus.pending;
  private _timestamp: number | null = null;

  private _isComplete = false;
  private _isExpired = false;
  private _isRan = false;

  constructor(
    private readonly _context: BettererContextΩ,
    private readonly _name: string,
    private readonly _test: BettererTest,
    private readonly _expected: BettererResultΩ,
    private readonly _files: BettererFilePaths
  ) {}

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get name(): string {
    return this._name;
  }

  public get expected(): BettererResultΩ {
    return this._expected;
  }

  public get files(): BettererFilePaths {
    return this._files;
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
    return this._expected.isNew;
  }

  public get isRan(): boolean {
    return this._isRan;
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

  public get result(): BettererResultΩ {
    assert(this._result);
    return this._result;
  }

  public get test(): BettererTest {
    return this._test;
  }

  public better(result: BettererResultΩ, isComplete: boolean): void {
    this._updateResult(BettererRunStatus.better, result, isComplete);
  }

  public end(): void {
    this._context.runEnd(this);
  }

  public failed(): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.failed;
  }

  public new(result: BettererResultΩ, isComplete: boolean): void {
    this._updateResult(BettererRunStatus.neww, result, isComplete);
  }

  public ran(): void {
    this._isRan = true;
  }

  public start(): void {
    const startTime = Date.now();
    this._isExpired = startTime > this._test.deadline;
    this._context.runStart(this);
    this._timestamp = startTime;
  }

  public same(result: BettererResultΩ): void {
    this._updateResult(BettererRunStatus.same, result);
  }

  public skipped(): void {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.skipped;
  }

  public update(result: BettererResultΩ): void {
    this._updateResult(BettererRunStatus.update, result);
    this._diff = this._context.runDiff(this);
  }

  public worse(result: BettererResultΩ): void {
    this._updateResult(BettererRunStatus.worse, result);
    this._diff = this._context.runDiff(this);
  }

  private _updateResult(status: BettererRunStatus, result: BettererResultΩ, isComplete = false) {
    assert.equal(this._status, BettererRunStatus.pending);
    this._status = status;
    this._isComplete = isComplete;
    this._result = result;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
