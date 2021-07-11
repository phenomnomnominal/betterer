import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererDiff, BettererTestBase, BettererTestConfig, BettererTestMeta } from '../test';
import { BettererRunStatus } from './run-summary';
import { BettererRun, BettererRunning } from './types';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

export class BettererWorkerRunΩ implements BettererRun {
  public readonly name: string;
  public readonly isNew: boolean;
  public readonly test: BettererTestConfig;

  constructor(
    test: BettererTestBase,
    testMeta: BettererTestMeta,
    public filePaths: BettererFilePaths | null,
    private _baseline: BettererResultΩ | null,
    private _expected: BettererResultΩ | null,
    public readonly timestamp: number
  ) {
    this.name = testMeta.name;
    this.isNew = testMeta.isNew;
    this.test = test.config;
  }

  public get baseline(): BettererResultΩ {
    assert(this._baseline);
    return this._baseline;
  }

  public get expected(): BettererResultΩ {
    assert(this._expected);
    return this._expected;
  }

  public run(config: BettererConfig): BettererRunning {
    const end = async (
      status: BettererRunStatus,
      result: BettererResult | null = null,
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererWorkerRunSummaryΩ> => {
      const baselineValue = this.isNew ? null : this.baseline.value;
      const resultValue = !result ? null : result.value;

      const delta = await this.test.progress(baselineValue, resultValue);

      const { resultsPath } = config;
      const { serialise } = this.test.serialiser;

      const resultSerialised = resultValue ? serialise(resultValue, resultsPath) : null;
      const baselineSerialised = this.isNew ? null : serialise(this.baseline.value, resultsPath);
      const expectedSerialised = this.isNew ? null : serialise(this.expected.value, resultsPath);

      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const isExpired = this.timestamp >= this.test.deadline;
      const isWorse = status === BettererRunStatus.worse;
      const isFailedOrSkipped = !result;

      let printed: string | null = null;
      const shouldPrint = !(isComplete || (this.isNew && isFailedOrSkipped));
      if (shouldPrint) {
        const toPrint = isFailedOrSkipped || isWorse ? this.expected : (result as BettererResult);
        const toPrintSerialised = this.test.serialiser.serialise(toPrint.value, config.resultsPath);
        printed = await this.test.printer(toPrintSerialised);
      }

      return new BettererWorkerRunSummaryΩ(
        this,
        resultSerialised,
        baselineSerialised,
        expectedSerialised,
        status,
        isComplete,
        isExpired,
        delta,
        diff,
        error,
        printed
      );
    };

    return {
      done: async (result: BettererResult): Promise<BettererWorkerRunSummaryΩ> => {
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
      failed: async (error: BettererError): Promise<BettererWorkerRunSummaryΩ> => {
        return end(BettererRunStatus.failed, null, null, error);
      },
      skipped: async (): Promise<BettererWorkerRunSummaryΩ> => {
        return end(BettererRunStatus.skipped);
      }
    };
  }
}
