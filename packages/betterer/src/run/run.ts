import assert from 'assert';
import { BettererFilePaths } from '../fs';
import { BettererResultΩ } from '../results';
import { BettererTestMeta } from '../test';
import { BettererRunSummaryΩ } from './run-summary';
import { BettererRun, BettererRunSummary, BettererWorker } from './types';

export class BettererRunΩ implements BettererRun {
  public isNew: boolean;
  public name: string;
  public timestamp: number;

  private _baseline: BettererResultΩ | null = null;
  private _expected: BettererResultΩ | null = null;
  private _filePaths: BettererFilePaths | null;

  constructor(private _worker: BettererWorker, public testMeta: BettererTestMeta, filePaths: BettererFilePaths) {
    this.isNew = testMeta.isNew;
    this.name = testMeta.name;

    if (!testMeta.isNew) {
      this._baseline = new BettererResultΩ(JSON.parse(testMeta.baselineJSON));
      this._expected = new BettererResultΩ(JSON.parse(testMeta.expectedJSON));
    }

    this._filePaths = this.testMeta.isFileTest ? filePaths : null;

    this.timestamp = Date.now();
  }

  public get baseline(): BettererResultΩ {
    assert(this._baseline);
    return this._baseline;
  }

  public get expected(): BettererResultΩ {
    assert(this._expected);
    return this._expected;
  }

  public get filePaths(): BettererFilePaths {
    assert(this._filePaths);
    return this._filePaths;
  }

  public async run(isSkipped: boolean): Promise<BettererRunSummary> {
    // YOU GOTTA RELEASE THE WORKER!
    return new BettererRunSummaryΩ(await this._worker.run(this.filePaths, isSkipped, this.timestamp));
  }
}

export type BettererRunsΩ = ReadonlyArray<BettererRunΩ>;
