import type { BettererOptionsMerge } from '../fs/index.js';

import { BettererMergerΩ } from '../fs/index.js';
import { printResults } from '../results/index.js';

/**
 * @public Resolve any merge conflicts in the specified results file.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * await betterer.merge(options);
 * ```
 *
 * @param options - Options for merging conflicts in the results file.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while merging conflicts in the results file.
 */
export async function merge(options: BettererOptionsMerge = {}): Promise<void> {
  const merger = await BettererMergerΩ.create(options);
  const merged = await merger.merge();
  await merger.write(printResults(merged));
}
