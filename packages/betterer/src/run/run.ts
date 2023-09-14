import type { BettererWorkerRunConfig } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunWorkerHandleΩ, BettererRunWorkerPoolΩ } from './run-worker-pool.js';
import type { BettererRun, BettererRunSummary } from './types.js';

import { getTime__ } from '@betterer/time';

import { BettererResultΩ } from '../results/index.js';

export class BettererRunΩ implements BettererRun {
  public readonly isNew: boolean;
  public readonly isSkipped: boolean;

  private constructor(
    public name: string,
    private _workerHandle: BettererRunWorkerHandleΩ,
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
    runWorkerPool: BettererRunWorkerPoolΩ,
    testName: string,
    config: BettererWorkerRunConfig,
    filePaths: BettererFilePaths,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererRunΩ> {
    const workerHandle = runWorkerPool.getWorkerHandle();
    await workerHandle.free;
    workerHandle.claim();
    const testMeta = await workerHandle.worker.init(testName, config, versionControl);
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
    await this._workerHandle.free;
    this._workerHandle.claim();
    const timestamp = getTime__();
    const summary = await this._workerHandle.worker.run(this.name, this.filePaths, isSkipped, timestamp);
    this._workerHandle.release();
    return summary;
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
