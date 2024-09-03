import type { BettererRunSummaries, BettererTestNames } from '@betterer/betterer';

export function testNames(runs: BettererRunSummaries): BettererTestNames {
  return runs.map((run) => run.name);
}
