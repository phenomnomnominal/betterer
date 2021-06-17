import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererFilePaths } from '../fs';
import { BettererReporterΩ } from '../reporters';
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
    private readonly _reporter: BettererReporterΩ,
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
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportRunStart = this._reporter.runStart(this, this._lifecycle.promise);

    const end = async (diff: BettererDiff | null = null, isComplete = false) => {
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
      await reportRunStart;
      await this._reporter.runEnd(runSummary);
    };

    return {
      better: async (result: BettererResult, isComplete: boolean): Promise<void> => {
        this._updateResult(BettererRunStatus.better, result);
        await end(null, isComplete);
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
        this._updateResult(BettererRunStatus.new, result);
        await end(null, isComplete);
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
        await end(this.test.differ(this.expected.value, result));
      },
      worse: async (result: BettererResult): Promise<void> => {
        this._updateResult(BettererRunStatus.worse, result);
        await end(this.test.differ(this.expected.value, result));
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
