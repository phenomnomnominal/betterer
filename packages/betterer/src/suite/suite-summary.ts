import type { BettererFilePaths } from '../fs/index.js';
import type { BettererResultsSerialised } from '../results/index.js';
import type { BettererRuns, BettererRunSummaries } from '../run/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererSuiteSummary } from './types.js';

import { invariantΔ } from '@betterer/errors';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  public readonly result: BettererResultsSerialised;

  constructor(
    public readonly filePaths: BettererFilePaths,
    public readonly runs: BettererRuns,
    public readonly runSummaries: BettererRunSummaries
  ) {
    this.result = this._mergeResult();
  }
  public get better(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isBetter);
  }

  public get changed(): BettererTestNames {
    return this._getChanged();
  }

  public get completed(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isComplete);
  }

  public get expired(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isExpired);
  }

  public get failed(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isFailed);
  }

  public get new(): BettererRunSummaries {
    return this.runSummaries.filter(
      (runSummary) => runSummary.isNew && !(runSummary.isSkipped || runSummary.isFailed || runSummary.isComplete)
    );
  }

  public get obsolete(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isObsolete && !runSummary.isRemoved);
  }

  public get ran(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => !(runSummary.isSkipped || runSummary.isFailed));
  }

  public get removed(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isRemoved);
  }

  public get same(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isSame && !runSummary.isComplete);
  }

  public get skipped(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isSkipped);
  }

  public get updated(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isUpdated);
  }

  public get worse(): BettererRunSummaries {
    return this.runSummaries.filter((runSummary) => runSummary.isWorse && !runSummary.isUpdated);
  }

  private _getChanged(): BettererTestNames {
    const obsoleteRunNames = this.obsolete.map((runSummary) => runSummary.name);
    const notFailedOrSkipped = this.runSummaries.filter((runSummary) => !runSummary.isFailed && !runSummary.isSkipped);
    const changedRuns = notFailedOrSkipped
      .filter((runSummary) => !runSummary.isNew)
      .filter((runSummary) => {
        const { result, expected } = runSummary;
        invariantΔ(result, 'Test is not _new_, _failed_, or _skipped_ so it must have a result!');
        invariantΔ(expected, 'Test is not _new_ so it must have an expected result!');
        return result.printed !== expected.printed;
      });
    const newRuns = notFailedOrSkipped.filter((runSummary) => runSummary.isNew && !runSummary.isComplete);
    const newOrChangedRunNames = [...changedRuns, ...newRuns].map((runSummary) => runSummary.name);
    return [...obsoleteRunNames, ...newOrChangedRunNames];
  }

  private _mergeResult(): BettererResultsSerialised {
    return this.runSummaries.reduce<BettererResultsSerialised>((results, runSummary) => {
      const { isFailed, isSkipped, isNew, isObsolete, isRemoved, isWorse } = runSummary;
      const isSkippedOrFailed = isSkipped || isFailed;
      if (isRemoved || (isSkippedOrFailed && isNew)) {
        return results;
      }
      const { expected, name, result } = runSummary;
      if ((isSkippedOrFailed && !isNew) || isWorse || isObsolete) {
        invariantΔ(expected, 'Test has successfully run in the past so it must have an expected result!');
        results[name] = { value: expected.printed };
        return results;
      }
      invariantΔ(result, 'Test has successfully run so it must have a new result!');
      results[name] = { value: result.printed };
      return results;
    }, {});
  }
}
