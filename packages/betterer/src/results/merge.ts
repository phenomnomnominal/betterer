import type { BettererResultsSerialised } from './types.js';

import { requireText } from './require.js';

/**
 * Takes two strings of JavaScript, evaluates their contents, and merges the results,
 * with the latter taking precedence.
 */
export function mergeResults(ours: string, theirs: string): BettererResultsSerialised {
  return { ...requireText(ours), ...requireText(theirs) };
}
