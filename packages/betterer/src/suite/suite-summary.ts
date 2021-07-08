import { BettererFilePaths } from '../fs';
import { BettererRunSummaries } from '../run';
import { BettererSuite, BettererSuiteSummary } from './types';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  public readonly filePaths: BettererFilePaths;
  public readonly unexpectedDiff: boolean;
  public readonly shouldWrite: boolean;

  constructor(
    suite: BettererSuite,
    public readonly runs: BettererRunSummaries,
    public readonly result: string,
    public readonly expected: string | null,
    ci: boolean
  ) {
    this.filePaths = suite.filePaths;
    const hasDiff = !!this.expected && this.expected !== this.result;
    this.unexpectedDiff = hasDiff && ci;
    const expectedDiff = hasDiff && !ci;
    this.shouldWrite = !this.expected || expectedDiff;
  }

  public get completed(): BettererRunSummaries {
    return this.runs.filter((run) => run.isComplete);
  }

  public get expired(): BettererRunSummaries {
    return this.runs.filter((run) => run.isExpired);
  }

  public get better(): BettererRunSummaries {
    return this.runs.filter((run) => run.isBetter);
  }

  public get failed(): BettererRunSummaries {
    return this.runs.filter((run) => run.isFailed);
  }

  public get new(): BettererRunSummaries {
    return this.runs.filter((run) => run.isNew && !(run.isSkipped || run.isFailed));
  }

  public get ran(): BettererRunSummaries {
    return this.runs.filter((run) => !(run.isSkipped || run.isFailed));
  }

  public get same(): BettererRunSummaries {
    return this.runs.filter((run) => run.isSame);
  }

  public get skipped(): BettererRunSummaries {
    return this.runs.filter((run) => run.isSkipped);
  }

  public get updated(): BettererRunSummaries {
    return this.runs.filter((run) => run.isUpdated);
  }

  public get worse(): BettererRunSummaries {
    return this.runs.filter((run) => run.isWorse);
  }
}
