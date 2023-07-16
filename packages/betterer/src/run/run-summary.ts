import type { BettererError } from '@betterer/errors';

import type { BettererFilePaths } from '../fs';
import type { BettererResult } from '../results';
import type { BettererDiff } from '../test';
import type { BettererDelta, BettererRun, BettererRunSummary } from './types';

export enum BettererRunStatus {
  better,
  failed,
  new,
  same,
  skipped,
  update,
  worse
}

export class BettererRunSummaryΩ implements BettererRunSummary {
  public readonly filePaths: BettererFilePaths | null;
  public readonly name: string;

  public readonly isBetter: boolean;
  public readonly isFailed: boolean;
  public readonly isNew: boolean;
  public readonly isSame: boolean;
  public readonly isSkipped: boolean;
  public readonly isUpdated: boolean;
  public readonly isWorse: boolean;

  constructor(
    run: BettererRun,
    public readonly result: BettererResult | null,
    public readonly baseline: BettererResult | null,
    public readonly expected: BettererResult | null,
    status: BettererRunStatus,
    public readonly isComplete: boolean,
    public readonly isExpired: boolean,
    public readonly delta: BettererDelta | null,
    public readonly diff: BettererDiff | null,
    public readonly error: BettererError | null,
    public readonly printed: string | null,
    public readonly timestamp: number
  ) {
    this.name = run.name;
    this.filePaths = run.filePaths;
    this.isBetter = status === BettererRunStatus.better;
    this.isFailed = status === BettererRunStatus.failed;
    this.isNew = status === BettererRunStatus.new;
    this.isSame = status === BettererRunStatus.same;
    this.isSkipped = status === BettererRunStatus.skipped;
    this.isUpdated = status === BettererRunStatus.update;
    this.isWorse = status === BettererRunStatus.worse;
  }
}
