import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { Defer, defer } from '../utils';
import { BettererRunSummaryΩ } from './run-summary';
import { BettererRun, BettererRunStarted, BettererRunSummary } from './types';

export enum BettererRunStatus {
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
  private _lifecycle: Defer<BettererRunSummary>;
  private _result: BettererResult | null = null;
  private _status: BettererRunStatus;

  constructor(
    public readonly name: string,
    private readonly _test: BettererTestConfig,
    public expected: BettererResult,
    private readonly _baseline: BettererResult,
    public filePaths: BettererFilePaths,
    isSkipped: boolean
  ) {
    this._status = isSkipped ? BettererRunStatus.skipped : BettererRunStatus.pending;
    this._lifecycle = defer();
  }

  public get isNew(): boolean {
    return this.expected.isNew;
  }

  public get isSkipped(): boolean {
    return this._status === BettererRunStatus.skipped;
  }

  public get lifecycle(): Promise<BettererRunSummary> {
    return this._lifecycle.promise;
  }

  public get test(): BettererTestConfig {
    return this._test;
  }

  public start(): BettererRunStarted {
    const startTime = Date.now();

    const end = async (diff: BettererDiff | null = null, isComplete = false): Promise<BettererRunSummary> => {
      const baselineValue = this._baseline.isNew ? null : this._baseline.value;
      const result = this._result || null;
      const resultValue = !this._result ? null : this._result.value;

      const delta = await this._test.progress(baselineValue, resultValue);
      const runSummary = new BettererRunSummaryΩ(
        this.lifecycle,
        this._test,
        this.name,
        this.filePaths,
        this.expected,
        startTime,
        isComplete,
        result,
        diff,
        delta,
        this._status
      );
      this._lifecycle.resolve(runSummary);
      return runSummary;
    };

    return {
      better: async (result: BettererResult, isComplete: boolean): Promise<BettererRunSummary> => {
        this._updateResult(BettererRunStatus.better, result);
        return end(null, isComplete);
      },
      failed: async (error: BettererError): Promise<BettererRunSummary> => {
        assert.strictEqual(this._status, BettererRunStatus.pending);
        this._status = BettererRunStatus.failed;
        this._lifecycle.reject(error);
        return end();
      },
      neww: async (result: BettererResult, isComplete: boolean): Promise<BettererRunSummary> => {
        this._updateResult(BettererRunStatus.new, result);
        return end(null, isComplete);
      },
      same: async (result: BettererResult): Promise<BettererRunSummary> => {
        this._updateResult(BettererRunStatus.same, result);
        return end();
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return end();
      },
      update: async (result: BettererResult): Promise<BettererRunSummary> => {
        this._updateResult(BettererRunStatus.update, result);
        return end(this.test.differ(this.expected.value, result.value));
      },
      worse: async (result: BettererResult): Promise<BettererRunSummary> => {
        this._updateResult(BettererRunStatus.worse, result);
        return end(this.test.differ(this.expected.value, result.value));
      }
    };
  }

  private _updateResult(status: BettererRunStatus, result: BettererResult) {
    assert.strictEqual(this._status, BettererRunStatus.pending);
    this._status = status;
    this._result = result;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
