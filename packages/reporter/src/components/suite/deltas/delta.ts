import type { BettererRunSummary } from '@betterer/betterer';

import { fileTestDelta } from './file-test-delta';

export function getDelta(runSummary: BettererRunSummary): string {
  if (runSummary.filePaths != null) {
    return fileTestDelta(runSummary.delta) || '';
  }
  return '';
}
