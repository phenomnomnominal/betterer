import { requireText } from './require';
import { BettererResults } from './types';

export function merge(ours: string, theirs: string): BettererResults {
  return { ...requireText(ours), ...requireText(theirs) };
}
