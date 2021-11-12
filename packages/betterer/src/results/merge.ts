import { requireText } from './require';
import { BettererResultsSerialised } from './types';

/**
 * Takes two strings of JavaScript, evaluates their contents, and merges the results,
 * with the latter taking precedence.
 */
export function mergeResults(ours: string, theirs: string): BettererResultsSerialised {
  return { ...requireText(ours), ...requireText(theirs) };
}
