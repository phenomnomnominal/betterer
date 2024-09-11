import type { BettererErrorDetails } from '@betterer/errors';
import type { BettererRunSummaries, BettererSuiteSummary, BettererTestNames } from '@betterer/betterer';

import { invariantΔ } from '@betterer/errors';

export function testNames(runs: BettererRunSummaries): BettererTestNames {
  return runs.map((run) => run.name);
}

export function testErrors(suiteSummary: BettererSuiteSummary): BettererErrorDetails {
  return suiteSummary.failed.flatMap((failed) => {
    invariantΔ(failed.error, 'A failed run will always have an `error`!');
    return [failed.name, failed.error];
  });
}
