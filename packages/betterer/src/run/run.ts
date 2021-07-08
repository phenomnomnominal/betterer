import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererContext } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererDiff, BettererTestBase, BettererTestConfig, BettererTestMeta } from '../test';
import { BettererRunSummaryΩ } from './run-summary';
import { BettererRun, BettererRunning, BettererRunSummary } from './types';

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
  public readonly isNew = this.expected.isNew;

  private _result: BettererResult | null = null;
  private _status: BettererRunStatus;
  private _timestamp: number | null = null;
  private _test: BettererTestBase;

  constructor(
    public readonly config: BettererConfig,
    public readonly name: string,
    private _testMeta: BettererTestMeta,
    public expected: BettererResult,
    private _baseline: BettererResult,
    public filePaths: BettererFilePaths | null
  ) {
    this._status = this._testMeta.isSkipped ? BettererRunStatus.skipped : BettererRunStatus.pending;
    this._test = this._testMeta.factory();
    this._test.config.configPath = this._testMeta.configPath;
  }

  public get timestamp(): number {
    assert(this._timestamp != null);
    return this._timestamp;
  }

  public get isSkipped(): boolean {
    return this._status === BettererRunStatus.skipped;
  }

  public get test(): BettererTestConfig {
    return this._test.config;
  }

  public async run(context: BettererContext): Promise<BettererRunSummary> {
    const running = this._start();

    if (this.isSkipped) {
      return running.skipped();
    }

    try {
      const result = new BettererResultΩ(await this.test.test(this, context));
      return running.done(result);
    } catch (error) {
      return running.failed(error);
    }
  }

  private _start(): BettererRunning {
    this._timestamp = Date.now();

    const end = async (
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererRunSummary> => {
      const baselineValue = this._baseline.isNew ? null : this._baseline.value;
      const resultValue = !this._result ? null : this._result.value;

      const delta = await this.test.progress(baselineValue, resultValue);
      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const runSummary = new BettererRunSummaryΩ(this, this._result, diff, delta, error, this._status, isComplete);
      return runSummary;
    };

    return {
      done: async (result: BettererResult): Promise<BettererRunSummary> => {
        if (this.isNew) {
          this._updateResult(BettererRunStatus.new, result);
          return end(null);
        }

        const comparison = await this.test.constraint(result.value, this.expected.value);

        if (comparison === BettererConstraintResult.same) {
          this._updateResult(BettererRunStatus.same, result);
          return end();
        }

        if (comparison === BettererConstraintResult.better) {
          this._updateResult(BettererRunStatus.better, result);
          return end();
        }

        if (this.config.update) {
          this._updateResult(BettererRunStatus.update, result);
          return end(this.test.differ(this.expected.value, result.value));
        }

        this._updateResult(BettererRunStatus.worse, result);
        return end(this.test.differ(this.expected.value, result.value));
      },
      failed: async (error: BettererError): Promise<BettererRunSummary> => {
        assert.strictEqual(this._status, BettererRunStatus.pending);
        this._status = BettererRunStatus.failed;
        return end(null, error);
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return end();
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
