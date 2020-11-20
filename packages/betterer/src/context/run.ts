import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererReporterΩ } from '../reporters';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { Defer, defer } from '../utils';
import { BettererFilePaths } from '../watcher';
import { BettererRun } from './types';

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
  private _lifecycle: Defer<void>;
  private _result: BettererResult | null = null;
  private _status: BettererRunStatus;
  private _timestamp: number | null = null;

  private _isComplete = false;
  private _isExpired = false;
  private _isRan = false;

  constructor(
    private readonly _reporter: BettererReporterΩ,
    private readonly _name: string,
    private readonly _test: BettererTestConfig,
    private readonly _expected: BettererResult,
    private readonly _filePaths: BettererFilePaths,
    isSkipped: boolean
  ) {
    this._status = isSkipped ? BettererRunStatus.skipped : BettererRunStatus.pending;
    this._lifecycle = defer();
  }

  public get diff(): BettererDiff {
    assert(this._diff);
    return this._diff;
  }

  public get lifecycle(): Promise<void> {
    return this._lifecycle.promise;
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
    this._lifecycle.resolve();
    await this._reporter.runEnd(this);
  }

  public async failed(error: BettererError): Promise<void> {
    this._lifecycle.reject(error);
    await this._reporter.runError(this, error);
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
    await this._reporter.runStart(this, this._lifecycle.promise);
    this._timestamp = startTime;
  }

  public same(result: BettererResult): void {
    this._updateResult(BettererRunStatus.same, result);
  }

  public update(result: BettererResult): void {
    this._updateResult(BettererRunStatus.update, result);
    this._diff = this.test.differ(this.expected.result, this.result.result);
  }

  public worse(result: BettererResult): void {
    this._updateResult(BettererRunStatus.worse, result);
    this._diff = this.test.differ(this.expected.result, this.result.result);
  }

  private _updateResult(status: BettererRunStatus, result: BettererResult, isComplete = false) {
    assert.strictEqual(this._status, BettererRunStatus.pending);
    this._status = status;
    this._isComplete = isComplete;
    this._result = result;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
