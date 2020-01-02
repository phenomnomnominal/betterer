import { Betterer, BettererDiff } from '../../betterer';
import { isFileBetterer } from '../../files';

import { defaultDiff } from './default-diff';
import { fileDiff } from './file-diff';

export function getDiff(
  betterer: Betterer<unknown, unknown>
): BettererDiff<unknown, unknown> {
  return function(
    current: unknown,
    serialisedCurrent: unknown,
    serialisedPrevious: unknown | null
  ): void {
    let diff = defaultDiff;
    if (isFileBetterer(betterer)) {
      diff = fileDiff as BettererDiff<unknown, unknown>;
    }
    return diff(betterer, current, serialisedCurrent, serialisedPrevious);
  };
}
