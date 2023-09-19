import type { BettererResultsSerialised } from './types.js';

import { importText } from '../import.js';

/**
 * Takes two strings of JavaScript, evaluates their contents, and merges the results,
 * with the latter taking precedence.
 */
export function mergeResults(ours: string, theirs: string): BettererResultsSerialised {
  return { ...importText(ours), ...importText(theirs) };
}
