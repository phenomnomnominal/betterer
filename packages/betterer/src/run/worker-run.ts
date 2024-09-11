import type { BettererConfig } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererResult } from '../results/index.js';
import type {
  BettererTestConfig,
  BettererTestMeta,
  BettererTestFactory,
  BettererTestMap,
  BettererTest
} from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRun, BettererRunning, BettererRunningEnd, BettererRunSummary } from './types.js';

import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError, isBettererErrorΔ } from '@betterer/errors';
import assert from 'node:assert';

import { forceRelativePaths, importDefault, parse } from '../fs/index.js';
import { BettererResultsΩ, BettererResultΩ } from '../results/index.js';
import { isBettererResolverTest, isBettererTest } from '../test/index.js';
import { BettererRunSummaryΩ } from './run-summary.js';
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

    // If we're in a worker, we need to populate the globals:
    if (process.env.BETTERER_WORKER !== 'false') {
      setGlobals(config, results, null, null, versionControl);
    }

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
    isFiltered: boolean,
    timestamp: number
  ): Promise<BettererRunSummary> {
    this.setFilePaths(filePaths);

    const { config, results } = getGlobals();
    const { resultsPath } = config;

    if (!this.runMeta.isNew) {
      const [baselineJSON, expectedJSON] = results.getExpected(this.name);
      this._baseline = this._deserialise(config.resultsPath, baselineJSON);
      this._expected = this._deserialise(config.resultsPath, expectedJSON);
    }

    const running = this._run(timestamp);

    if (this.runMeta.isSkipped || isFiltered) {
      return await running.skipped();
    }

    // No try/catch - the main thread handles the `isFailed` case:
    const result = await this.test.test(this);
    const serialisedResult = await this.test.serialiser.serialise(result, resultsPath);
    const printedResult = forceRelativePaths(await this.test.printer(serialisedResult), resultsPath);
    return await running.done(new BettererResultΩ(result, printedResult));
  }

  public setFilePaths(newFilePaths: BettererFilePaths | null) {
    this._filePaths = newFilePaths;
  }

  private _deserialise(resultsPath: string, resultJSON: string): BettererResultΩ | null {
    try {
      const serialised = JSON.parse(resultJSON) as unknown;
      const { deserialise } = this.test.serialiser;
      return new BettererResultΩ(deserialise(serialised, resultsPath), resultJSON);
    } catch {
      return null;
    }
  }

  private _serialise(resultsPath: string, deserialised: BettererResult): BettererResultΩ | null {
    try {
      const { serialise } = this.test.serialiser;
      return new BettererResultΩ(serialise(deserialised.value, resultsPath), deserialised.printed);
    } catch {
      return null;
    }
  }

  private _run(timestamp: number): BettererRunning {
    return {
      done: async (result: BettererResultΩ): Promise<BettererRunSummary> => {
        if (this.isNew) {
          return await this._end({ comparison: null, result, timestamp });
        }

        const comparison = await this.test.constraint(result.value, this.expected.value);

        if (comparison === BettererConstraintResult.same) {
          return await this._end({ comparison, result, timestamp });
        }

        const diff = this.test.differ(this.expected.value, result.value);
        return await this._end({ comparison, diff, result, timestamp });
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return await this._end({ timestamp, isSkipped: true });
      }
    };
  }

  private async _end(end: BettererRunningEnd): Promise<BettererRunSummary> {
    const { comparison, diff, result, timestamp, isSkipped } = end;
    const { config, versionControl } = getGlobals();
    const { resultsPath } = config;

    const isWorse = comparison === BettererConstraintResult.worse && !config.update;
    const isUpdated = comparison === BettererConstraintResult.worse && config.update;

    const { ci } = config;

    const isComplete = !!result && (await this.test.goal(result.value));
    const isExpired = timestamp >= this.test.deadline;
    const shouldPrint = !(isComplete || isSkipped);

    const baselineValue = this.isNew ? null : this.baseline.value;
    const delta = result ? await this.test.progress(baselineValue, result.value) : null;

    if (this.runMeta.needsFilePaths && !ci) {
      if (isComplete) {
        await versionControl.api.clearCache(this.name);
      } else if (shouldPrint && !isWorse) {
        await versionControl.api.updateCache(this.name, this.filePaths as Array<string>);
      }
    }

    // Make sure to use the serialised result so it can be passed back to the main thread:
    const serialisedResult = result ? this._serialise(resultsPath, result) : null;
    const serialisedBaseline = !this.isNew ? this._serialise(resultsPath, this.baseline) : null;
    const serialisedExpected = !this.isNew ? this._serialise(resultsPath, this.expected) : null;

    return new BettererRunSummaryΩ({
      baseline: serialisedBaseline,
      delta,
      diff: diff ?? null,
      expected: serialisedExpected,
      error: null,
      filePaths: this.filePaths,
      isBetter: comparison === BettererConstraintResult.better,
      isComplete,
      isExpired,
      isFailed: false,
      isNew: this.isNew,
      isSame: comparison === BettererConstraintResult.same,
      isSkipped: !!isSkipped,
      isUpdated,
      isWorse,
      name: this.name,
      result: serialisedResult,
      timestamp
    });
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
