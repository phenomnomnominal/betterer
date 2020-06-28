import { BettererRuns, BettererReporter, BettererFilePaths } from '@betterer/betterer';
import { info, overwrite } from '@betterer/logger';
import {
  testBetter,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testSame,
  testWorse,
  contextError,
  quote
} from '@betterer/reporter';

import { watchEnd, watchStart, filesChecked, filesChecking } from './messages';

export const watchReporter: BettererReporter = {
  contextStart(): void {
    info(watchStart());
  },
  contextEnd(): void {
    info(watchEnd());
  },
  contextError,
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
      const name = quote(run.name);
      if (run.isBetter) {
        report += `\n  ${testBetter(name)}`;
        return;
      }
      if (run.isExpired) {
        report += `\n  ${testExpired(name)}`;
        return;
      }
      if (run.isFailed) {
        report += `\n  ${testFailed(run.name)}`;
        return;
      }
      if (run.isNew) {
        report += `\n  ${testNew(name)}`;
        return;
      }
      if (run.isSame) {
        report += `\n  ${testSame(name)}`;
        return;
      }
      if (run.isWorse) {
        report += `\n  ${testWorse(name)}`;
        return;
      }
      if (run.isComplete) {
        report += `\n  ${testComplete(name, run.isNew)}`;
        return;
      }
    });
    overwrite(report);
  }
};
