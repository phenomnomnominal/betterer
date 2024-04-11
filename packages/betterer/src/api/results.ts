import type { BettererResultsSummary } from '../results/index.js';
import type { BettererOptionsResults } from './types.js';

import { BettererResultsSummaryΩ } from '../results/index.js';

/**
 * @public Get a summary of the results of the defined {@link @betterer/betterer#BettererTest | `BettererTest`s}.
 *
 * **Betterer** will read the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file }
 * and the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file} and return a summary of the results.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const resultsSummary = await betterer.results(options);
 * ```
 *
 * @param options - Options for getting the summary of the results.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while getting the summary of the results.
 */
export function results(options: BettererOptionsResults = {}): Promise<BettererResultsSummary> {
  return BettererResultsSummaryΩ.create(options);
}
