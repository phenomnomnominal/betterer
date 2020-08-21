import { BettererRuns, BettererReporter, BettererFilePaths } from '@betterer/betterer';
import { info, overwrite } from '@betterer/logger';
import {
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testSameΔ,
  testUpdatedΔ,
  testWorseΔ,
  contextErrorΔ,
  quoteΔ
} from '@betterer/reporter';

import { watchEnd, watchStart, filesChecked, filesChecking } from './messages';

export const watchReporter: BettererReporter = {
  contextStart(): void {
    info(watchStart());
  },
  contextEnd(): void {
    info(watchEnd());
  },
  contextError: contextErrorΔ,
  runsStart(_: BettererRuns, files: BettererFilePaths): void {
    overwrite(filesChecking(files.length));
  },
  runsEnd(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `  ${filesChecked(files.length)}:\n`;
    files.forEach((filePath) => {
      report += `\n    ${filePath}`;
    });
    report += '\n';
    runs.forEach((run) => {
      const name = quoteΔ(run.name);
      if (run.isBetter) {
        report += `\n  ${testBetterΔ(name)}`;
        return;
      }
      if (run.isExpired) {
        report += `\n  ${testExpiredΔ(name)}`;
        return;
      }
      if (run.isFailed) {
        report += `\n  ${testFailedΔ(run.name)}`;
        return;
      }
      if (run.isNew) {
        report += `\n  ${testNewΔ(name)}`;
        return;
      }
      if (run.isSame) {
        report += `\n  ${testSameΔ(name)}`;
        return;
      }
      if (run.isUpdated) {
        report += `\n  ${testUpdatedΔ(name)}`;
        return;
      }
      if (run.isWorse) {
        report += `\n  ${testWorseΔ(name)}`;
        return;
      }
      if (run.isComplete) {
        report += `\n  ${testCompleteΔ(name, run.isNew)}`;
        return;
      }
    });
    overwrite(report);
  }
};
