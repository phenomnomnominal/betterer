import { Betterer, BettererFiles, FileBetterer, isFileBetterer } from '../../betterer';

import { defaultDiff } from './default-diff';
import { fileDiff } from './file-diff';
import { BettererDiffReporter } from './types';

export function getDiffReporter(betterer: Betterer): BettererDiffReporter {
  return function (current: BettererFiles | unknown, previous: BettererFiles | unknown | null): void {
    if (isFileBetterer(betterer)) {
      return fileDiff(betterer as FileBetterer, current as BettererFiles, previous as BettererFiles);
    }
    return defaultDiff(betterer, current, previous);
  };
}
