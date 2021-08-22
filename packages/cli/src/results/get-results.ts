import { betterer, BettererOptionsResults, BettererResults } from '@betterer/betterer';

export function run(options: BettererOptionsResults): Promise<BettererResults> {
  return betterer.results(options);
}
