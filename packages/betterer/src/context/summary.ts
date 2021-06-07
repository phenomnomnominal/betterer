import { BettererRunsΩ } from './run';
import { BettererRuns, BettererSummary } from './types';

export class BettererSummaryΩ implements BettererSummary {
  public readonly unexpectedDiff: boolean;

  constructor(
    public readonly runs: BettererRunsΩ,
    public readonly result: string,
    public readonly expected: string | null,
    ci: boolean
  ) {
    const hasDiff = !!this.expected && this.expected !== this.result;
    this.unexpectedDiff = hasDiff && ci;
  }

  public get completed(): BettererRuns {
    return this.runs.filter((run) => run.isComplete);
  }

  public get expired(): BettererRuns {
    return this.runs.filter((run) => run.isExpired);
  }

  public get better(): BettererRuns {
    return this.runs.filter((run) => run.isBetter);
  }

  public get failed(): BettererRuns {
    return this.runs.filter((run) => run.isFailed);
  }

  public get new(): BettererRuns {
    return this.runs.filter((run) => run.isNew && run.isRan);
  }

  public get obsolete(): BettererRuns {
    return this.runs.filter((run) => run.isObsolete);
  }

  public get ran(): BettererRuns {
    return this.runs.filter((run) => run.isRan);
  }

  public get same(): BettererRuns {
    return this.runs.filter((run) => run.isSame);
  }

  public get skipped(): BettererRuns {
    return this.runs.filter((run) => run.isSkipped);
  }

  public get updated(): BettererRuns {
    return this.runs.filter((run) => run.isUpdated);
  }

  public get worse(): BettererRuns {
    return this.runs.filter((run) => run.isWorse);
  }
}
