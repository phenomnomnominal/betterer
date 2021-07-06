import { BettererError } from '@betterer/errors';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererDiff } from '../test';
import { BettererRunStatus } from './run-summary';
import { BettererRun } from './types';

export class BettererWorkerRunSummaryΩ {
  public readonly name: string;
  public readonly filePaths: BettererFilePaths | null;
  public readonly isExpired: boolean;
  public readonly isNew: boolean;
  public readonly timestamp: number;

  constructor(
    run: BettererRun,
    public readonly result: unknown,
    public readonly status: BettererRunStatus,
    public readonly isComplete: boolean,
    public readonly delta: BettererDelta | null = null,
    public readonly diff: BettererDiff | null = null,
    public readonly error: BettererError | null = null
  ) {
    this.name = run.name;
    this.filePaths = run.filePaths;
    this.timestamp = run.timestamp;
    this.isExpired = this.timestamp >= run.test.deadline;
    this.isNew = run.expected.isNew;
  }
}
