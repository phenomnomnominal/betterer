import { BettererRunSummary } from '@betterer/betterer';

import { fileTestDelta } from './file-test-delta';

export function getDelta(run: BettererRunSummary): string {
  if (run.filePaths != null) {
    return fileTestDelta(run.delta) || '';
  }
  return '';
}
