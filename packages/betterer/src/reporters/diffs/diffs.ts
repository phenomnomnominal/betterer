import { Betterer } from '../../betterer';
import { isFileBetterer } from '../../files';

import { defaultDiff } from './default-diff';
import { fileDiff } from './file-diff';
import { BettererDiff } from './types';

export function getDiff(betterer: Betterer): BettererDiff {
  return function(
    current: unknown,
    serialisedCurrent: unknown,
    serialisedPrevious: unknown | null
  ): void {
    let diff = defaultDiff;
    if (isFileBetterer(betterer)) {
      diff = fileDiff as BettererDiff;
    }
    return diff(betterer, current, serialisedCurrent, serialisedPrevious);
  };
}
