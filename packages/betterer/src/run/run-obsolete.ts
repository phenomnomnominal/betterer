import type { BettererResult } from '../results/index.js';
import type { BettererRun, BettererRunSummary } from './types.js';

import { BettererRunSummaryΩ } from './run-summary.js';

export class BettererRunObsoleteΩ implements BettererRun {
  public readonly expected: BettererResult;
  public readonly isNew = false;
  public readonly isObsolete = true;
  public readonly isOnly = false;
  public readonly isRemoved: boolean;
  public readonly isSkipped = false;
  public readonly filePaths = null;

  constructor(
    public readonly name: string,
    public readonly baseline: BettererResult,
    update = false
  ) {
    this.isRemoved = update;
    this.expected = baseline;
  }

  public async run(): Promise<BettererRunSummary> {
    return await Promise.resolve(
      new BettererRunSummaryΩ({
        baseline: this.baseline,
        delta: null,
        diff: null,
        error: null,
        expected: this.expected,
        filePaths: this.filePaths,
        isBetter: false,
        isComplete: false,
        isExpired: false,
        isFailed: false,
        isNew: false,
        isObsolete: this.isObsolete,
        isRemoved: this.isRemoved,
        isSame: false,
        isSkipped: false,
        isUpdated: false,
        isWorse: false,
        name: this.name,
        result: null,
        timestamp: -Infinity
      })
    );
  }
}
