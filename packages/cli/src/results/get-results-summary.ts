import { betterer, BettererOptionsResults, BettererResultsSummary } from '@betterer/betterer';

export function run(options: BettererOptionsResults): Promise<BettererResultsSummary> {
  return betterer.results(options);
}
