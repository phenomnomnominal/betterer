import type { BettererLogger } from '@betterer/logger';

import type { BettererFilePaths } from '../fs/index.js';
import type { BettererResult } from '../results/index.js';
import type {
  BettererTest,
  BettererTestConfig,
  BettererTestFactory,
  BettererTestMap,
  BettererTestMeta
} from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRun, BettererRunning, BettererRunningEnd, BettererRunSummary } from './types.js';

import assert from 'node:assert';
import { BettererConstraintResult } from '@betterer/constraints';
import { BettererError, isBettererErrorΔ } from '@betterer/errors';

import { importTranspiled } from '../fs/index.js';
import { getGlobals } from '../globals.js';
import { BettererResultΩ } from '../results/index.js';
import { isBettererTest } from '../test/index.js';
import { forceRelativePaths, isFunction } from '../utils.js';
import { BettererRunSummaryΩ } from './run-summary.js';

export class BettererWorkerRunΩ implements BettererRun, BettererTestConfig {
  public readonly isNew: boolean;
  public readonly isObsolete = false;
  public readonly isRemoved = false;
  public readonly isSkipped: boolean;
  public readonly name: string;

  public readonly constraint = this._test.constraint;
  public readonly deadline = this._test.deadline;
  public readonly goal = this._test.goal;
  public readonly test = this._test.test;
  public readonly differ = this._test.differ;
  public readonly printer = this._test.printer;
  public readonly progress = this._test.progress;
  public readonly serialiser = this._test.serialiser;

  private _baseline: BettererResultΩ | null = null;
  private _expected: BettererResultΩ | null = null;
  private _filePaths: BettererFilePaths | null = null;
  private _logger: BettererLogger | null = null;

  constructor(
    private _test: BettererTestConfig,
    public readonly testMeta: BettererTestMeta,
    public readonly runMeta: BettererRunMeta,
    baseline: string | null,
    expected: string | null
  ) {
    this.isNew = runMeta.isNew;
    this.isSkipped = runMeta.isSkipped;
    this.name = testMeta.name;

    if (baseline && expected) {
      this._baseline = this._deserialise(baseline);
      this._expected = this._deserialise(expected);
    }
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

  public get logger(): BettererLogger {
    assert(this._logger != null);
    return this._logger;
  }

  public async run(
    logger: BettererLogger,
    filePaths: BettererFilePaths | null,
    isFiltered: boolean,
    timestamp: number
  ): Promise<BettererRunSummary> {
    this._logger = logger;
    this.setFilePaths(filePaths);

    const { config } = getGlobals();
    const { resultsBasePath } = config;

    const running = this._run(timestamp);

    if (this.runMeta.isSkipped || isFiltered) {
      return await running.skipped();
    }

    // No try/catch - the main thread handles the `isFailed` case:
    const result = await this.test(this);
    const serialisedResult = await this.serialiser.serialise.call(this, result, resultsBasePath);
    const printedResult = forceRelativePaths(await this.printer(serialisedResult), resultsBasePath);
    return await running.done(new BettererResultΩ(result, printedResult));
  }

  public setFilePaths(newFilePaths: BettererFilePaths | null) {
    this._filePaths = newFilePaths;
  }

  private _deserialise(resultJSON: string): BettererResultΩ | null {
    try {
      const serialised = JSON.parse(resultJSON) as unknown;
      const { config } = getGlobals();
      return new BettererResultΩ(this.serialiser.deserialise(serialised, config.resultsBasePath), resultJSON);
    } catch {
      return null;
    }
  }

  private _serialise(deserialised: BettererResult): BettererResultΩ | null {
    try {
      const { config } = getGlobals();
      const deserialisedΩ = deserialised as BettererResultΩ;
      return new BettererResultΩ(
        this.serialiser.serialise.call(this, deserialisedΩ.value, config.resultsBasePath),
        deserialisedΩ.printed
      );
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

        const comparison = await this.constraint(result.value, this.expected.value);

        if (comparison === BettererConstraintResult.same) {
          return await this._end({ comparison, result, timestamp });
        }

        const diff = await this.differ(this.expected.value, result.value);
        return await this._end({ comparison, diff, result, timestamp });
      },
      skipped: async (): Promise<BettererRunSummary> => {
        return await this._end({ timestamp, isSkipped: true });
      }
    };
  }

  private async _end(end: BettererRunningEnd): Promise<BettererRunSummary> {
    const { comparison, diff, result, timestamp, isSkipped } = end;
    const { config } = getGlobals();

    const isWorse = comparison === BettererConstraintResult.worse;
    const isUpdated = isWorse && config.update;

    const isComplete = !!result && (await this.goal(result.value));

    const isExpired = timestamp >= this.deadline;

    const baselineValue = this.isNew ? null : this.baseline.value;
    const delta = result ? await this.progress(baselineValue, result.value) : null;

    // Make sure to use the serialised result so it can be passed back to the main thread:
    const serialisedResult = result ? this._serialise(result) : null;

    return new BettererRunSummaryΩ({
      baseline: this._baseline,
      delta,
      diff: diff ?? null,
      expected: this._expected,
      error: null,
      filePaths: this.filePaths,
      isBetter: comparison === BettererConstraintResult.better,
      isComplete,
      isExpired,
      isFailed: false,
      isNew: this.isNew,
      isObsolete: this.isObsolete,
      isRemoved: this.isRemoved,
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

export async function loadTest(testMeta: BettererTestMeta): Promise<BettererTest> {
  const { name } = testMeta;

  let test: BettererTest | null = null;
  try {
    const factory = await loadTestFactory(testMeta);
    test = await factory();
  } catch (e) {
    if (isBettererErrorΔ(e)) {
      throw e;
    }
  }
  const isTest = isBettererTest(test);

  if (!test || !isTest) {
    throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
  }

  return test;
}

async function loadTestFactory(testMeta: BettererTestMeta): Promise<BettererTestFactory> {
  const { configPath, name } = testMeta;
  try {
    const exports = (await importTranspiled(configPath)) as BettererTestMap;
    const factory = exports[name];
    if (!isFunction(factory)) {
      throw new BettererError(`"${name}" must be a function.`);
    }
    return factory;
  } catch (error) {
    throw new BettererError(`could not create "${name}" from "${configPath}". 😔`, error as BettererError);
  }
}
