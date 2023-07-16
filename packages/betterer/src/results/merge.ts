import type { BettererResultsSerialised } from './types';

import { requireText } from './require';

/**
 * Takes two strings of JavaScript, evaluates their contents, and merges the results,
 * with the latter taking precedence.
 */
export function mergeResults(ours: string, theirs: string): BettererResultsSerialised {
  return { ...requireText(ours), ...requireText(theirs) };
}
