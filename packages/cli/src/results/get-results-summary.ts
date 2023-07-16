import type { BettererOptionsResults, BettererResultsSummary } from '@betterer/betterer';

import { betterer } from '@betterer/betterer';

export function run(options: BettererOptionsResults): Promise<BettererResultsSummary> {
  return betterer.results(options);
}
