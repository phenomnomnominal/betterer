import type { BettererFilePaths } from '../fs';
import type { BettererRuns, BettererRunSummaries } from '../run';
import type { BettererTestNames } from '../test';
import type { BettererSuiteSummary } from './types';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  constructor(
    public readonly filePaths: BettererFilePaths,
    public readonly runs: BettererRuns,
    public readonly runSummaries: BettererRunSummaries,
    public readonly changed: BettererTestNames
  ) {}

  public get completed(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isComplete);
  }

  public get expired(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isExpired);
  }

  public get better(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isBetter);
  }

  public get failed(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isFailed);
  }

  public get new(): BettererRunSummaries {
    return this.runSummaries.filter(
      (runSummary) => runSummary.isNew && !(runSummary.isSkipped || runSummary.isFailed || runSummary.isComplete)
    );
  }

  public get ran(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => !(runSummary.isSkipped || runSummary.isFailed));
  }

  public get same(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isSame);
  }

  public get skipped(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isSkipped);
  }

  public get updated(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isUpdated);
  }

  public get worse(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isWorse);
  }
}

export type BettererSuiteSummariesΩ = ReadonlyArray<BettererSuiteSummaryΩ>;
