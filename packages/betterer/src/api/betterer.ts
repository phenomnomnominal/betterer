import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererOptionsStart } from './types.js';

import { BettererRunnerΩ } from '../runner/index.js';

/**
 * @public Run **Betterer** with the given options.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const suiteSummary = await betterer(options);
 * ```
 *
 * @param options - Options for running **Betterer**.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while running **Betterer**.
 */
export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSuiteSummary> {
  const runner = await BettererRunnerΩ.create(options);
  return await runner.run();
}
