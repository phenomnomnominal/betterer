import { BettererFilePaths } from '../fs';
import { BettererRunNames, BettererRunSummaries } from '../run';
import { BettererSuiteSummary } from './types';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  constructor(
    public readonly filePaths: BettererFilePaths,
    public readonly runs: BettererRunSummaries,
    public readonly changed: BettererRunNames
  ) {}

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

export type BettererSuiteSummariesΩ = ReadonlyArray<BettererSuiteSummaryΩ>;
