import type { BettererConfig } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererResult } from '../results/index.js';
import type {
  BettererDiff,
  BettererTestConfig,
  BettererTestMeta,
  BettererTestFactory,
  BettererTestMap,
  BettererTest
} from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRun, BettererRunning, BettererRunSummary } from './types.js';

import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError, isBettererErrorΔ } from '@betterer/errors';
import assert from 'node:assert';

import { forceRelativePaths, importDefault, parse } from '../fs/index.js';
import { BettererResultsΩ, BettererResultΩ } from '../results/index.js';
import { isBettererResolverTest, isBettererTest } from '../test/index.js';
import { BettererRunStatus, BettererRunSummaryΩ } from './run-summary.js';
import { isFunction } from '../utils.js';
import { getGlobals, setGlobals } from '../globals.js';

export class BettererWorkerRunΩ implements BettererRun {
  public readonly isNew: boolean;
  public readonly isSkipped: boolean;
  public readonly name: string;

  private _baseline: BettererResultΩ | null = null;
  private _expected: BettererResultΩ | null = null;
  private _filePaths: BettererFilePaths | null = null;

  private constructor(
    public readonly test: BettererTestConfig,
    public readonly testMeta: BettererTestMeta,
    public readonly runMeta: BettererRunMeta
  ) {
    this.isNew = runMeta.isNew;
    this.isSkipped = runMeta.isSkipped;
    this.name = testMeta.name;
  }

  public get baseline(): BettererResultΩ {
    assert(this._baseline != null);
    return this._baseline;
  }

  public get expected(): BettererResultΩ {
    assert(this._expected != null);
    return this._expected;
  }

  public get filePaths(): BettererFilePaths | null {
    return this._filePaths;
  }

  public static async create(
    testMeta: BettererTestMeta,
    config: BettererConfig,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererWorkerRunΩ> {
    const { name } = testMeta;
    const expected = await parse(config.resultsPath);
    const results = new BettererResultsΩ(expected);
    setGlobals({ config, results, versionControl });

    const isNew = !results.hasResult(name);

    const testFactory = await loadTestFactory(testMeta);

    let test: BettererTest | null = null;
    try {
      test = await testFactory();
    } catch (e) {
      if (isBettererErrorΔ(e)) {
        throw e;
      }
    }

    const isTest = isBettererTest(test);
    const isResolverTest = isBettererResolverTest(test);

    if (!test || !(isTest || isResolverTest)) {
      throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
    }

    return new BettererWorkerRunΩ(test.config, testMeta, {
      needsFilePaths: isResolverTest,
      isNew,
      isOnly: test.isOnly,
      isSkipped: test.isSkipped
    });
  }

  public async run(
    filePaths: BettererFilePaths | null,
    isSkipped: boolean,
    timestamp: number
  ): Promise<BettererRunSummary> {
    this.setFilePaths(filePaths);

    const { config, results, versionControl } = getGlobals();

    if (!this.runMeta.isNew) {
      const [baselineJSON, expectedJSON] = results.getExpected(this.name);
      this._baseline = this._deserialise(config.resultsPath, baselineJSON);
      this._expected = this._deserialise(config.resultsPath, expectedJSON);
    }

    const running = this._run(config, timestamp, versionControl);

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

  public setFilePaths(newFilePaths: BettererFilePaths | null) {
    this._filePaths = newFilePaths;
  }

  private _deserialise(resultsPath: string, resultJSON: string): BettererResultΩ | null {
    try {
      const serialised = JSON.parse(resultJSON) as unknown;
      const { deserialise } = this.test.serialiser;
      return new BettererResultΩ(deserialise(serialised, resultsPath));
    } catch {
      return null;
    }
  }

  private _run(
    config: BettererConfig,
    timestamp: number,
    versionControl: BettererVersionControlWorker
  ): BettererRunning {
    const end = async (
      status: BettererRunStatus,
      result: BettererResult | null = null,
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

      const { resultsPath, ci } = config;
      const { serialise } = this.test.serialiser;

      const resultSerialised = resultValue != null ? new BettererResultΩ(serialise(resultValue, resultsPath)) : null;
      const baselineSerialised = this.isNew ? null : new BettererResultΩ(serialise(this.baseline.value, resultsPath));
      const expectedSerialised = this.isNew ? null : new BettererResultΩ(serialise(this.expected.value, resultsPath));

      const isComplete = resultValue != null && (await this.test.goal(resultValue));
      const isExpired = timestamp >= this.test.deadline;
      let printed: string | null = null;
      const shouldPrint = !(isComplete || (this.isNew && (isFailed || isSkipped)));
      if (shouldPrint) {
        const toPrint = isFailed || isSkipped || isWorse ? this.expected : result!;
        const toPrintSerialised = this.test.serialiser.serialise(toPrint.value, config.resultsPath);
        printed = forceRelativePaths(await this.test.printer(toPrintSerialised), config.versionControlPath);
      }

      if (this.runMeta.needsFilePaths && !ci) {
        if (isComplete) {
          await versionControl.api.clearCache(this.name);
        } else if (isBetter || isSame || isUpdated || this.isNew) {
          await versionControl.api.updateCache(this.name, this.filePaths as Array<string>);
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

export async function loadTestFactory(testMeta: BettererTestMeta): Promise<BettererTestFactory> {
  const { configPath, name } = testMeta;
  try {
    const exports = (await importDefault(configPath)) as BettererTestMap;
    const factory = exports[name];
    if (!isFunction(factory)) {
      throw new BettererError(`"${name}" must be a function.`);
    }
    return factory;
  } catch (error) {
    throw new BettererError(`could not create "${name}" from "${configPath}". 😔`, error as BettererError);
  }
}
