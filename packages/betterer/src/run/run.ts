import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererContext } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererDiff, BettererTestConfig, BettererTestMeta, isBettererFileTest } from '../test';
import { isBettererTest } from '../test/test';
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
  public readonly isOnly: boolean;
  public filePaths: BettererFilePaths | null;
  public readonly test: BettererTestConfig;

  private _expected: BettererResult | null = null;
  private _isSkipped: boolean;
  private _timestamp: number | null = null;

  constructor(
    public readonly name: string,
    private _testMeta: BettererTestMeta,
    filePaths: BettererFilePaths,
    public readonly isNew: boolean
  ) {
    const test = this._testMeta.factory();

    if (!isBettererTest(test) && !isBettererFileTest(test)) {
      throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
    }

    test.config.configPath = this._testMeta.configPath;
    this.test = test.config;

    // Only run BettererFileTests when a list of filePaths is given:
    const onlyFileTests = filePaths.length > 0;
    const isFileTest = isBettererFileTest(test);
    this.filePaths = isFileTest ? filePaths : null;
    this._isSkipped = test.isSkipped || (onlyFileTests && !isFileTest);
    this.isOnly = test.isOnly;
  }

  public get expected(): BettererResult {
    assert(this._expected);
    return this._expected;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public get timestamp(): number {
    assert(this._timestamp != null);
    return this._timestamp;
  }

  public async run(
    context: BettererContext,
    baseline: BettererResult,
    expected: BettererResult
  ): Promise<BettererRunSummary> {
    const { resultsPath } = context.config;

    baseline = this._deserialiseResult(baseline, resultsPath);
    expected = this._deserialiseResult(expected, resultsPath);

    const running = this._start(context.config, baseline, expected);

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

  public skip(): void {
    this._isSkipped = true;
  }

  private _start(config: BettererConfig, baseline: BettererResult, expected: BettererResult): BettererRunning {
    this._timestamp = Date.now();
    this._expected = expected;

    const end = async (
      status: BettererRunStatus,
      result: BettererResult | null = null,
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererRunSummary> => {
      const resultValue = !result ? null : result.value;

      const baselineValue = baseline.isNew ? null : baseline.value;
      const delta = await this.test.progress(baselineValue, resultValue);

      const isComplete = resultValue != null && (await this.test.goal(resultValue));

      const summary = new BettererRunSummaryΩ(this, this.test, result, diff, delta, error, status, isComplete);
      await summary.serialise(config.resultsPath);
      return summary;
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

  private _deserialiseResult(result: BettererResult, resultsPath: string): BettererResult {
    if (result.isNew) {
      return result;
    }
    return new BettererResultΩ(this.test.serialiser.deserialise(result.value, resultsPath));
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
