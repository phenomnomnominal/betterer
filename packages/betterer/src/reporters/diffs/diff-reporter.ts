import {
  Betterer,
  BettererFiles,
  BettererFileMarksMap,
  FileBetterer,
  isFileBetterer
} from '../../betterer';

import { defaultDiff } from './default-diff';
import { fileDiff } from './file-diff';
import { BettererDiffReporter } from './types';

export function getDiffReporter(betterer: Betterer): BettererDiffReporter {
  return function(
    current: BettererFiles | unknown,
    serialisedCurrent: BettererFileMarksMap | unknown,
    serialisedPrevious: BettererFileMarksMap | null | unknown
  ): void {
    if (isFileBetterer(betterer)) {
      return fileDiff(
        betterer as FileBetterer,
        current as BettererFiles,
        serialisedCurrent as BettererFileMarksMap,
        serialisedPrevious as BettererFileMarksMap | null
      );
    }
    return defaultDiff(
      betterer,
      current,
      serialisedCurrent,
      serialisedPrevious
    );
  };
}
