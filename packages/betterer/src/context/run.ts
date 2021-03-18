import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererReporterΩ } from '../reporters';
import { BettererResult } from '../results';
import { BettererFilePaths } from '../runner';
import { BettererDiff, BettererTestConfig } from '../test';
import { Defer, defer } from '../utils';
import { BettererDelta, BettererRun, BettererRunStarted } from './types';

enum BettererRunStatus {
  better,
  failed,
  pending,
  new,
  obsolete,
  same,
  skipped,
  update,
  worse
}

export class BettererRunΩ implements BettererRun {
  private _diff: BettererDiff | null = null;
  private _lifecycle: Defer<void>;
  private _result: BettererResult | null = null;
  private _delta: BettererDelta | null = null;
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
    private readonly _baseline: BettererResult,
    private readonly _filePaths: BettererFilePaths,
    isSkipped: boolean,
    isObsolete: boolean
  ) {
    this._status = isSkipped ? BettererRunStatus.skipped : BettererRunStatus.pending;
    this._status = isObsolete ? BettererRunStatus.obsolete : this._status;
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

  public get delta(): BettererDelta | null {
    return this._delta;
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

  public get isObsolete(): boolean {
    return this._status === BettererRunStatus.obsolete;
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

  public ran(): void {
    this._isRan = true;
  }

  public start(): BettererRunStarted {
    const startTime = Date.now();
    this._isExpired = startTime >= this._test.deadline;
    const reportRunStart = this._reporter.runStart(this, this._lifecycle.promise);
    this._timestamp = startTime;

    const end = async () => {
      if (this._test.progress) {
        const baselineValue = this._baseline.isNew ? null : this._baseline.value;
        const resultValue = !this._result ? null : this._result.value;
        this._delta = await this._test.progress(baselineValue, resultValue);
      }
      this._lifecycle.resolve();
      await reportRunStart;
      await this._reporter.runEnd(this);
    };

    return {
      better: async (result: BettererResult, isComplete: boolean): Promise<void> => {
        this._updateResult(BettererRunStatus.better, result, isComplete);
        await end();
      },
      failed: async (error: BettererError): Promise<void> => {
        assert.strictEqual(this._status, BettererRunStatus.pending);
        this._status = BettererRunStatus.failed;
        this._lifecycle.reject(error);
        await reportRunStart;
        await this._reporter.runError(this, error);
        await end();
      },
      neww: async (result: BettererResult, isComplete: boolean): Promise<void> => {
        this._updateResult(BettererRunStatus.new, result, isComplete);
        await end();
      },
      same: async (result: BettererResult): Promise<void> => {
        this._updateResult(BettererRunStatus.same, result);
        await end();
      },
      skipped: async (): Promise<void> => {
        await end();
      },
      update: async (result: BettererResult): Promise<void> => {
        this._updateResult(BettererRunStatus.update, result);
        this._diff = this.test.differ(this.expected.value, this.result.value);
        await end();
      },
      worse: async (result: BettererResult): Promise<void> => {
        this._updateResult(BettererRunStatus.worse, result);
        this._diff = this.test.differ(this.expected.value, this.result.value);
        await end();
      }
    };
  }

  private _updateResult(status: BettererRunStatus, result: BettererResult, isComplete = false) {
    assert.strictEqual(this._status, BettererRunStatus.pending);
    this._status = status;
    this._isComplete = isComplete;
    this._result = result;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
