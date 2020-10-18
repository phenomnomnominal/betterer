import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererContextΩ } from './context';
import { BettererContext, BettererRun } from './types';

enum BettererRunStatus {
  better,
  failed,
  pending,
  new,
  same,
  skipped,
  update,
  worse
}

export class BettererRunΩ implements BettererRun {
  private _diff: BettererDiff | null = null;
  private _result: BettererResult | null = null;
  private _status: BettererRunStatus;
  private _timestamp: number | null = null;

  private _isComplete = false;
  private _isExpired = false;
  private _isRan = false;

  constructor(
    private readonly _context: BettererContext,
    private readonly _name: string,
    private readonly _test: BettererTestConfig,
    private readonly _expected: BettererResult,
    private readonly _filePaths: BettererFilePaths,
    isSkipped: boolean
  ) {
    this._status = isSkipped ? BettererRunStatus.skipped : BettererRunStatus.pending;
  }

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get name(): string {
    return this._name;
  }

  public get expected(): BettererResult {
    return this._expected;
  }

  public get filePaths(): BettererFilePaths {
    return this._filePaths;
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

  public get result(): BettererResult {
    assert(this._result);
    return this._result;
  }

  public get test(): BettererTestConfig {
    return this._test;
  }

  public better(result: BettererResult, isComplete: boolean): void {
    this._updateResult(BettererRunStatus.better, result, isComplete);
  }

  public async end(): Promise<void> {
    const contextΩ = this._context as BettererContextΩ;
    await contextΩ.runEnd(this);
  }

  public async failed(e: BettererError): Promise<void> {
    const contextΩ = this._context as BettererContextΩ;
    await contextΩ.runError(this, e);
    assert.strictEqual(this._status, BettererRunStatus.pending);
    this._status = BettererRunStatus.failed;
  }

  public new(result: BettererResult, isComplete: boolean): void {
    this._updateResult(BettererRunStatus.new, result, isComplete);
  }

  public ran(): void {
    this._isRan = true;
  }

  public async start(): Promise<void> {
    const startTime = Date.now();
    this._isExpired = startTime > this._test.deadline;
    const contextΩ = this._context as BettererContextΩ;
    await contextΩ.runStart(this);
    this._timestamp = startTime;
  }

  public same(result: BettererResult): void {
    this._updateResult(BettererRunStatus.same, result);
  }

  public update(result: BettererResult): void {
    this._updateResult(BettererRunStatus.update, result);
    const contextΩ = this._context as BettererContextΩ;
    this._diff = contextΩ.runDiff(this);
  }

  public worse(result: BettererResult): void {
    this._updateResult(BettererRunStatus.worse, result);
    const contextΩ = this._context as BettererContextΩ;
    this._diff = contextΩ.runDiff(this);
  }

  private _updateResult(status: BettererRunStatus, result: BettererResult, isComplete = false) {
    assert.strictEqual(this._status, BettererRunStatus.pending);
    this._status = status;
    this._isComplete = isComplete;
    this._result = result;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
