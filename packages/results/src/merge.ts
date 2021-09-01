import { requireText } from './require';
import { BettererResults } from './types';

/**
 * Takes two strings of JavaScript, evaluates their contents, and merges the results,
 * with the latter taking precedence.
 *
 * @internal This could change at any point! Please don't use!
 */
export function mergeResults__(ours: string, theirs: string): BettererResults {
  return { ...requireText(ours), ...requireText(theirs) };
}
