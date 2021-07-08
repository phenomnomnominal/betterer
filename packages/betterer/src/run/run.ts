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
  new,
  same,
  skipped,
  update,
  worse
}

export class BettererRunΩ implements BettererRun {
  public readonly isNew = this.expected.isNew;
  public readonly isSkipped = this._testMeta.isSkipped;
  public readonly test: BettererTestConfig;

  private _timestamp: number | null = null;
  private _test: BettererTestBase;

  constructor(
    public readonly name: string,
    private _testMeta: BettererTestMeta,
    public expected: BettererResult,
    private _baseline: BettererResult,
    public filePaths: BettererFilePaths | null
  ) {
    this._test = this._testMeta.factory();
    this.test = this._test.config;
    this.test.configPath = this._testMeta.configPath;
  }

  public get timestamp(): number {
    assert(this._timestamp != null);
    return this._timestamp;
  }

  public async run(context: BettererContext): Promise<BettererRunSummary> {
    const running = this._start(context.config);

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

  private _start(config: BettererConfig): BettererRunning {
    this._timestamp = Date.now();

    const end = async (
      status: BettererRunStatus,
      result: BettererResult | null = null,
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererRunSummary> => {
      const baselineValue = this._baseline.isNew ? null : this._baseline.value;
      const resultValue = !result ? null : result.value;

      const delta = await this.test.progress(baselineValue, resultValue);
      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const runSummary = new BettererRunSummaryΩ(this, result, diff, delta, error, status, isComplete);
      return runSummary;
    };

    return {
      done: async (result: BettererResult): Promise<BettererRunSummary> => {
        if (this.isNew) {
          return end(BettererRunStatus.new, result);
        }

        const comparison = await this.test.constraint(result.value, this.expected.value);

        if (comparison === BettererConstraintResult.same) {
          return end(BettererRunStatus.same, result);
        }

        if (comparison === BettererConstraintResult.better) {
          return end(BettererRunStatus.better, result);
        }

        const status = config.update ? BettererRunStatus.update : BettererRunStatus.worse;
        return end(status, result, this.test.differ(this.expected.value, result.value));
      },
      failed: async (error: BettererError): Promise<BettererRunSummary> => {
        return end(BettererRunStatus.failed, null, null, error);
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return end(BettererRunStatus.skipped);
      }
    };
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
