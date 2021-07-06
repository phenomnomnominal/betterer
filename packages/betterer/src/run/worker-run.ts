import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererFilePaths } from '../fs';
import { createGlobals } from '../globals';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererDiff, BettererTestBase, BettererTestConfig, BettererTestMeta, loadTests } from '../test';
import { BettererRunStatus } from './run-summary';
import { BettererRun, BettererRunning } from './types';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

export class BettererWorkerRunΩ implements BettererRun {
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

  public start(): BettererRunning {
    this._timestamp = Date.now();

    const end = async (
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererWorkerRunSummaryΩ> => {
      const baselineValue = this._baseline.isNew ? null : this._baseline.value;
      const resultValue = !this._result ? null : this._result.value;

      const delta = await this.test.progress(baselineValue, resultValue);
      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const result = resultValue ? this._test.config.serialiser.serialise(resultValue, this.config.resultsPath) : null;
      return new BettererWorkerRunSummaryΩ(this, result, this._status, isComplete, delta, diff, error);
    };

    return {
      done: async (result: BettererResult): Promise<BettererWorkerRunSummaryΩ> => {
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
      failed: async (error: BettererError): Promise<BettererWorkerRunSummaryΩ> => {
        assert.strictEqual(this._status, BettererRunStatus.pending);
        this._status = BettererRunStatus.failed;
        return end(null, error);
      },
      skipped: async (): Promise<BettererWorkerRunSummaryΩ> => {
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

export async function run(
  optionsJSON: string,
  testName: string,
  filePaths: BettererFilePaths
): Promise<BettererWorkerRunSummaryΩ> {
  const options = JSON.parse(optionsJSON) as BettererConfig;
  options.silent = true;
  const globals = await createGlobals(options);
  const { config, results, versionControl } = globals;
  await results.sync();
  await versionControl.sync();
  const tests = loadTests(config);
  const testMeta = tests[testName];
  const test = testMeta.factory();
  const [baseline, expected] = await Promise.all([
    results.getBaseline(testName, test),
    results.getExpectedResult(testName, test)
  ]);
  const runΩ = new BettererWorkerRunΩ(config, testName, testMeta, baseline, expected, filePaths);
  const running = runΩ.start();

  if (runΩ.isSkipped) {
    return running.skipped();
  }
  try {
    const result = new BettererResultΩ(await test.config.test(runΩ, globals));
    return running.done(result);
  } catch (error) {
    return running.failed(error);
  }
}
