import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig, BettererWorkerRunConfig, createWorkerConfig } from '../config';
import { BettererFilePaths, BettererVersionControlWorker, forceRelativePaths } from '../fs';
import { BettererResultsFileΩ, BettererResultΩ } from '../results';
import { BettererDiff, BettererTestConfig, BettererTestMeta, isBettererFileTest, loadTestMeta } from '../test';
import { isBettererTest } from '../test';
import { BettererGlobals } from '../types';
import { BettererRunStatus, BettererRunSummaryΩ } from './run-summary';
import { BettererRun, BettererRunning, BettererRunSummary } from './types';

export class BettererWorkerRunΩ implements BettererRun {
  public readonly config: BettererConfig;
  public readonly isNew: boolean;
  public readonly isSkipped: boolean;
  public filePaths: BettererFilePaths | null = null;

  private _baseline: BettererResultΩ | null = null;
  private _expected: BettererResultΩ | null = null;

  private constructor(
    public readonly name: string,
    public readonly globals: BettererGlobals,
    public readonly testMeta: BettererTestMeta,
    public readonly test: BettererTestConfig
  ) {
    this.config = globals.config;
    this.isNew = testMeta.isNew;
    this.isSkipped = testMeta.isSkipped;
  }

  public get baseline(): BettererResultΩ {
    assert(this._baseline != null);
    return this._baseline;
  }

  public get expected(): BettererResultΩ {
    assert(this._expected != null);
    return this._expected;
  }

  public static async create(
    runConfig: BettererWorkerRunConfig,
    name: string,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererWorkerRunΩ> {
    const config = await createWorkerConfig(runConfig);
    const resultsFile = await BettererResultsFileΩ.create(config.resultsPath, versionControl);
    const globals = { config, resultsFile, versionControl };

    const isNew = !resultsFile.hasResult(name);

    const testFactories = loadTestMeta(config);
    const testFactoryMeta = testFactories[name];
    const test = await testFactoryMeta.factory();

    const isTest = isBettererTest(test);
    const isFileTest = isBettererFileTest(test);

    if (!(isTest || isFileTest)) {
      throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
    }

    test.config.configPath = testFactoryMeta.configPath;

    const baseTestMeta = {
      name,
      configPath: testFactoryMeta.configPath,
      isFileTest,
      isOnly: test.isOnly,
      isSkipped: test.isSkipped
    };

    let testMeta: BettererTestMeta;
    if (isNew) {
      testMeta = {
        ...baseTestMeta,
        isNew: true,
        baselineJSON: null,
        expectedJSON: null
      };
    } else {
      const [baselineJSON, expectedJSON] = resultsFile.getExpected(name);
      testMeta = {
        ...baseTestMeta,
        isNew: false,
        baselineJSON,
        expectedJSON
      };
    }

    return new BettererWorkerRunΩ(name, globals, testMeta, test.config);
  }

  public async run(
    filePaths: BettererFilePaths | null,
    isSkipped: boolean,
    timestamp: number
  ): Promise<BettererRunSummary> {
    this.filePaths = filePaths;

    if (!this.testMeta.isNew) {
      this._baseline = this._deserialise(this.testMeta.baselineJSON);
      this._expected = this._deserialise(this.testMeta.expectedJSON);
    }

    const running = this._run(this.config, timestamp);

    if (isSkipped) {
      return await running.skipped();
    }

    try {
      const result = new BettererResultΩ(await this.test.test(this));
      return await running.done(result);
    } catch (error) {
      return await running.failed(error as BettererError);
    }
  }

  private _deserialise(resultJSON: string): BettererResultΩ | null {
    try {
      const serialised = JSON.parse(resultJSON) as unknown;
      const { resultsPath } = this.config;
      const { deserialise } = this.test.serialiser;
      return new BettererResultΩ(deserialise(serialised, resultsPath));
    } catch {
      return null;
    }
  }

  private _run(config: BettererConfig, timestamp: number): BettererRunning {
    const end = async (
      status: BettererRunStatus,
      result: BettererResultΩ | null = null,
      diff: BettererDiff | null = null,
      error: BettererError | null = null
    ): Promise<BettererRunSummary> => {
      const isBetter = status === BettererRunStatus.better;
      const isSame = status === BettererRunStatus.same;
      const isUpdated = status === BettererRunStatus.update;
      const isSkipped = status === BettererRunStatus.skipped;
      const isFailed = status === BettererRunStatus.failed;
      const isWorse = status === BettererRunStatus.worse;

      const baselineValue = this.isNew ? null : this.baseline.value;
      const resultValue = !result ? null : result.value;

      const delta = await this.test.progress(baselineValue, resultValue);

      const { resultsPath } = config;
      const { serialise } = this.test.serialiser;

      const resultSerialised = resultValue != null ? new BettererResultΩ(serialise(resultValue, resultsPath)) : null;
      const baselineSerialised = this.isNew ? null : new BettererResultΩ(serialise(this.baseline.value, resultsPath));
      const expectedSerialised = this.isNew ? null : new BettererResultΩ(serialise(this.expected.value, resultsPath));

      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const isExpired = timestamp >= this.test.deadline;
      let printed: string | null = null;
      const shouldPrint = !(isComplete || (this.isNew && (isFailed || isSkipped)));
      if (shouldPrint) {
        const toPrint = isFailed || isSkipped || isWorse ? this.expected : (result as BettererResultΩ);
        const toPrintSerialised = this.test.serialiser.serialise(toPrint.value, config.resultsPath);
        printed = forceRelativePaths(await this.test.printer(toPrintSerialised), config.versionControlPath);
      }

      if (this.testMeta.isFileTest) {
        if (isComplete) {
          await this.globals.versionControl.clearCache(this.name);
        } else if (isBetter || isSame || isUpdated || this.isNew) {
          await this.globals.versionControl.updateCache(this.name, this.filePaths as Array<string>);
        }
      }

      return new BettererRunSummaryΩ(
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
        printed,
        timestamp
      );
    };

    return {
      done: async (result: BettererResultΩ): Promise<BettererRunSummary> => {
        if (this.isNew) {
          return await end(BettererRunStatus.new, result);
        }

        const comparison = await this.test.constraint(result.value, this.expected.value);

        if (comparison === BettererConstraintResult.same) {
          return await end(BettererRunStatus.same, result);
        }

        const diff = this.test.differ(this.expected.value, result.value);
        if (comparison === BettererConstraintResult.better) {
          return await end(BettererRunStatus.better, result, diff);
        }

        const status = config.update ? BettererRunStatus.update : BettererRunStatus.worse;
        return await end(status, result, diff);
      },
      failed: async (error: BettererError): Promise<BettererRunSummary> => {
        return await end(BettererRunStatus.failed, null, null, error);
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return await end(BettererRunStatus.skipped);
      }
    };
  }
}
