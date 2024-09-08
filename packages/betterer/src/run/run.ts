import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/types.js';
import type { BettererRun, BettererRunSummary, BettererRunWorkerHandle, BettererRunWorkerPool } from './types.js';

import { getTimeΔ } from '@betterer/time';

import { BettererResultΩ } from '../results/index.js';
import { getGlobals } from '../globals.js';

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

  public static async create(
    runWorkerPool: BettererRunWorkerPool,
    testMeta: BettererTestMeta,
    filePaths: BettererFilePaths
  ): Promise<BettererRunΩ> {
    const workerHandle = runWorkerPool.getWorkerHandle();
    const worker = await workerHandle.claim();

    const globals = getGlobals();

    const { config, versionControl } = globals;
    const workerConfig = {
      ...config,
      workers: 1
    };

    // `BettererReporter` instance can't be passed to the worker_thread, but
    // the worker doesn't actually need the it, so just ignore it.
    delete (workerConfig as Partial<BettererConfig>).reporter;

    // TODO: Make `globals.results` a worker so it can be passed across thread boundaries:
    const runMeta = await worker.api.init(testMeta, workerConfig, versionControl);
    workerHandle.release();

    const { results } = globals;
    let baseline: BettererResultΩ | null = null;
    let expected: BettererResultΩ | null = null;
    const isNew = !results.hasResult(testMeta.name);
    if (!isNew) {
      const [baselineJSON, expectedJSON] = results.getExpected(testMeta.name);
      baseline = new BettererResultΩ(JSON.parse(baselineJSON), baselineJSON);
      expected = new BettererResultΩ(JSON.parse(expectedJSON), baselineJSON);
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
    const summary = await worker.api.run(this.name, this.filePaths, isFiltered, timestamp);
    this._workerHandle.release();
    return summary;
  }
}
