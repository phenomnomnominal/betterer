import type { BettererFilePaths } from '../fs/index.js';
import type { BettererRuns, BettererRunSummaries } from '../run/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererSuiteSummary } from './types.js';

export class BettererSuiteSummaryΩ implements BettererSuiteSummary {
  public readonly better = this.runSummaries.filter((runSummary) => runSummary.isBetter);
  public readonly completed = this.runSummaries.filter((runSummary) => runSummary.isComplete);
  public readonly expired = this.runSummaries.filter((runSummary) => runSummary.isExpired);
  public readonly failed = this.runSummaries.filter((runSummary) => runSummary.isFailed);
  public readonly new = this.runSummaries.filter(
    (runSummary) => runSummary.isNew && !(runSummary.isSkipped || runSummary.isFailed || runSummary.isComplete)
  );
  public readonly ran = this.runSummaries.filter((runSummary) => !(runSummary.isSkipped || runSummary.isFailed));
  public readonly same = this.runSummaries.filter((runSummary) => runSummary.isSame);
  public readonly skipped = this.runSummaries.filter((runSummary) => runSummary.isSkipped);
  public readonly updated = this.runSummaries.filter((runSummary) => runSummary.isUpdated);
  public readonly worse = this.runSummaries.filter((runSummary) => runSummary.isWorse);

  constructor(
    public readonly filePaths: BettererFilePaths,
    public readonly runs: BettererRuns,
    public readonly runSummaries: BettererRunSummaries,
    public readonly changed: BettererTestNames
  ) {}
}
