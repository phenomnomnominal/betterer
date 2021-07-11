import { BettererError } from '@betterer/errors';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererDiff } from '../test';
import { BettererRunStatus } from './run-summary';
import { BettererRun } from './types';

export class BettererWorkerRunSummaryΩ {
  public readonly filePaths: BettererFilePaths | null;
  public readonly isNew: boolean;
  public readonly name: string;
  public readonly timestamp: number;

  constructor(
    run: BettererRun,
    public readonly result: unknown,
    public readonly baseline: unknown,
    public readonly expected: unknown,
    public readonly status: BettererRunStatus,
    public readonly isComplete: boolean,
    public readonly isExpired: boolean,
    public readonly delta: BettererDelta | null = null,
    public readonly diff: BettererDiff | null = null,
    public readonly error: BettererError | null = null,
    public readonly printed: string | null
  ) {
    this.name = run.name;
    this.filePaths = run.filePaths;
    this.timestamp = run.timestamp;
    this.isNew = run.isNew;
  }
}
