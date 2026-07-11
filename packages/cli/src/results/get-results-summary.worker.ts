import type { BettererOptionsResultsSummary, BettererResultsSummary } from '@betterer/betterer';

import { betterer } from '@betterer/betterer';
import { exposeToMainΔ } from '@betterer/worker';

/** @knipignore part of worker API */
export function run(options: BettererOptionsResultsSummary): Promise<BettererResultsSummary> {
  return betterer.results(options);
}

exposeToMainΔ({ run });
