import type { BettererFilePaths } from '../fs/index.js';
import type { BettererResultsSerialised } from '../results/index.js';
import type { BettererRuns, BettererRunSummaries } from '../run/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererSuiteSummary } from './types.js';

import { invariantΔ } from '@betterer/errors';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  public readonly result: BettererResultsSerialised;

  constructor(
    private readonly _expectedTestNames: BettererTestNames,
    public readonly filePaths: BettererFilePaths,
    public readonly runs: BettererRuns,
    public readonly runSummaries: BettererRunSummaries
  ) {
    this.result = this._mergeResult();
  }

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

  public get changed(): BettererTestNames {
    return this._getChanged();
  }

  private _getChanged(): BettererTestNames {
    const missingRunNames = this._expectedTestNames.filter(
      (name) => !this.runSummaries.find((runSummary) => runSummary.name === name)
    );
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
    return [...missingRunNames, ...newOrChangedRunNames];
  }

  private _mergeResult(): BettererResultsSerialised {
    return this.runSummaries.reduce<BettererResultsSerialised>((results, runSummary) => {
      const { isComplete, isFailed, isSkipped, isNew, isWorse } = runSummary;
      const isSkippedOrFailed = isSkipped || isFailed;
      if (isComplete || (isSkippedOrFailed && isNew)) {
        return results;
      }
      const { expected, name, result } = runSummary;
      if ((isSkippedOrFailed && !isNew) || isWorse) {
        invariantΔ(expected, 'Test is not _new_, or _worse_ so it must have an expected result!');
        results[name] = { value: expected.printed };
        return results;
      }
      invariantΔ(result, 'Test is not _completed_, _skipped_ or _failed_ so it must have a new result!');
      results[name] = { value: result.printed };
      return results;
    }, {});
  }
}
