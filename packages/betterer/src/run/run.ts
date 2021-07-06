import assert from 'assert';
import { BettererConfig } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererResult, BettererResultΩ } from '../results';
import { BettererTestConfig } from '../test';
import { Defer, defer } from '../utils';
import { BettererRunSummaryΩ } from './run-summary';
import { BettererRun, BettererRunSummary, BettererWorker } from './types';

export class BettererRunΩ implements BettererRun {
  private _lifecycle: Defer<BettererRunSummary>;
  private _timestamp: number | null = null;

  constructor(
    private _worker: BettererWorker,
    public readonly name: string,
    private readonly _test: BettererTestConfig,
    public expected: BettererResult,
    public filePaths: BettererFilePaths,
    private _isSkipped: boolean
  ) {
    this._lifecycle = defer();
  }

  public get isNew(): boolean {
    return this.expected.isNew;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public get test(): BettererTestConfig {
    return this._test;
  }

  public get timestamp(): number {
    assert(this._timestamp != null);
    return this._timestamp;
  }

  public async run(config: BettererConfig): Promise<BettererRunSummary> {
    this._timestamp = Date.now();
    const workerSummary = await this._worker.run(JSON.stringify(config), this.name, this.filePaths);
    const result = new BettererResultΩ(this.test.serialiser.deserialise(workerSummary.result, config.resultsPath));
    const summary = new BettererRunSummaryΩ(this, workerSummary, result);
    if (summary.isFailed) {
      assert(summary.error);
      this._lifecycle.reject(summary.error);
    } else {
      this._lifecycle.resolve(summary);
    }
    return summary;
  }
}
