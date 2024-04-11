import type { BettererConfig } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRun, BettererRunSummary, BettererRunWorkerHandle, BettererRunWorkerPool } from './types.js';

import { getTime__ } from '@betterer/time';

import { BettererResultΩ } from '../results/index.js';

export class BettererRunΩ implements BettererRun {
  public readonly isNew: boolean;
  public readonly isSkipped: boolean;

  private constructor(
    public name: string,
    private _workerHandle: BettererRunWorkerHandle,
    public testMeta: BettererTestMeta,
    public baseline: BettererResultΩ | null,
    public expected: BettererResultΩ | null,
    public filePaths: BettererFilePaths | null
  ) {
    this.isNew = testMeta.isNew;
    this.isSkipped = testMeta.isSkipped;

    // Always run all files for a new test, even if just passed a single file:
    if (this.isNew && this.filePaths) {
      this.filePaths = [];
    }
  }

  public static async create(
    runWorkerPool: BettererRunWorkerPool,
    testName: string,
    config: BettererConfig,
    filePaths: BettererFilePaths,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererRunΩ> {
    const workerHandle = runWorkerPool.getWorkerHandle();
    const worker = await workerHandle.claim();

    // `BettererReporter` instance can't be passed to the worker_thread, but
    // the worker doesn't actually need the it, so just ignore it.
    const workerConfig = { ...config };
    delete (workerConfig as Partial<BettererConfig>).reporter;

    const testMeta = await worker.api.init(testName, workerConfig, versionControl);
    workerHandle.release();

    const baseline = !testMeta.isNew ? new BettererResultΩ(JSON.parse(testMeta.baselineJSON)) : null;
    const expected = !testMeta.isNew ? new BettererResultΩ(JSON.parse(testMeta.expectedJSON)) : null;

    return new BettererRunΩ(
      testName,
      workerHandle,
      testMeta,
      baseline,
      expected,
      testMeta.isFileTest ? filePaths : null
    );
  }

  public async run(isSkipped: boolean): Promise<BettererRunSummary> {
    const worker = await this._workerHandle.claim();
    const timestamp = getTime__();
    const summary = await worker.api.run(this.name, this.filePaths, isSkipped, timestamp);
    this._workerHandle.release();
    return summary;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
