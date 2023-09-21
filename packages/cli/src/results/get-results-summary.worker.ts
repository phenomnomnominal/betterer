import type { BettererOptionsResults, BettererResultsSummary } from '@betterer/betterer';

import { betterer } from '@betterer/betterer';
import { exposeWorker } from '@betterer/worker';

export function run(options: BettererOptionsResults): Promise<BettererResultsSummary> {
  return betterer.results(options);
}

exposeWorker({
  run
});
