import type { BettererError } from '@betterer/errors';

import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/types.js';
import type { BettererRun, BettererRunSummary, BettererRunWorkerHandle } from './types.js';

import { getTimeΔ } from '@betterer/time';

import { BettererResultΩ } from '../results/index.js';
import { getGlobals } from '../globals.js';
import { BettererRunSummaryΩ } from './run-summary.js';

export class BettererRunΩ implements BettererRun {
  public readonly isNew: boolean;
  public readonly isOnly: boolean;
  public readonly isSkipped: boolean;
  public readonly name: string;

  private constructor(
    private _workerHandle: BettererRunWorkerHandle,
    public testMeta: BettererTestMeta,
    public runMeta: BettererRunMeta,
    public baseline: BettererResultΩ | null,
    public expected: BettererResultΩ | null,
    public filePaths: BettererFilePaths | null
  ) {
    this.isNew = !(baseline && expected);
    this.isOnly = runMeta.isOnly;
    this.isSkipped = runMeta.isSkipped;
    this.name = testMeta.name;

    // Always run all files for a new test, even if just passed a single file:
    if (this.isNew && this.filePaths) {
      this.filePaths = [];
    }
  }

  public static async create(testMeta: BettererTestMeta, filePaths: BettererFilePaths): Promise<BettererRunΩ> {
    const globals = getGlobals();
    const { config, results, runWorkerPool, versionControl } = globals;

    const workerHandle = runWorkerPool.getWorkerHandle();
    const worker = await workerHandle.claim();

    const workerConfig = {
      ...config,
      workers: 1
    };

    // `BettererReporter` instance can't be passed to the worker_thread, but
    // the worker doesn't actually need the it, so just ignore it.
    delete (workerConfig as Partial<BettererConfig>).reporter;

    const runMeta = await worker.api.init(testMeta, workerConfig, results, versionControl);
    workerHandle.release();

    let baseline: BettererResultΩ | null = null;
    let expected: BettererResultΩ | null = null;

    const isNew = !(await results.api.hasBaseline(testMeta.name));
    if (!isNew) {
      const baselineSerialised = await results.api.getBaseline(testMeta.name);
      const expectedSerialised = await results.api.getExpected(testMeta.name);
      baseline = new BettererResultΩ(JSON.parse(baselineSerialised), baselineSerialised);
      expected = new BettererResultΩ(JSON.parse(expectedSerialised), expectedSerialised);
    }

    return new BettererRunΩ(
      workerHandle,
      testMeta,
      runMeta,
      baseline,
      expected,
      runMeta.needsFilePaths ? filePaths : null
    );
  }

  public async run(isFiltered: boolean): Promise<BettererRunSummary> {
    const worker = await this._workerHandle.claim();
    const timestamp = getTimeΔ();
    try {
      return await worker.api.run(this.name, this.filePaths, isFiltered, timestamp);
    } catch (error) {
      return new BettererRunSummaryΩ({
        baseline: this.baseline,
        delta: null,
        diff: null,
        error: error as BettererError,
        expected: this.expected,
        filePaths: this.filePaths,
        isBetter: false,
        isComplete: false,
        isExpired: false,
        isFailed: true,
        isNew: this.isNew,
        isSame: false,
        isSkipped: this.isSkipped || isFiltered,
        isUpdated: false,
        isWorse: false,
        name: this.name,
        result: null,
        timestamp: timestamp
      });
    } finally {
      this._workerHandle.release();
    }
  }
}
