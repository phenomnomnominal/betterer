import { BettererError, logError } from '@betterer/errors';
import { error, info, success, warn, logo } from '@betterer/logger';

import { BettererContext } from '../context';
import { BettererContextReporter } from './types';

export const contextSerial: BettererContextReporter = {
  start(): void {
    logo();
  },
  complete(context: BettererContext): void {
    const { stats } = context;
    const ran = stats.ran.length;
    const failed = stats.failed.length;
    const nnew = stats.new.length;
    const obsolete = stats.obsolete.length;
    const better = stats.better.length;
    const worse = stats.worse.length;
    const same = stats.same.length;
    const skipped = stats.skipped.length;
    const { completed } = stats;

    info(`${ran} ${getThings(ran)} got checked. 🤔`);
    if (failed) {
      error(`${failed} ${getThings(failed)} failed to run. 🔥`);
    }
    if (nnew) {
      info(`${nnew} ${getThings(nnew)} got checked for the first time! 🎉`);
    }
    if (obsolete) {
      info(`${obsolete} ${getThings(obsolete)} are no longer needed! 🤪`);
    }
    if (better) {
      success(`${better} ${getThings(better)} got better! 😍`);
    }
    if (completed.length) {
      completed.forEach(testName => {
        success(`"${testName}" met its goal! 🎉`);
      });
    }
    if (worse) {
      error(`${worse} ${getThings(worse)} got worse. 😔`);
    }
    if (same) {
      warn(`${same} ${getThings(same)} stayed the same. 😐`);
    }
    if (skipped) {
      warn(`${skipped} ${getThings(skipped)} got skipped. ❌`);
    }
  },
  error(error: BettererError, printed: string) {
    logError(error);
    process.stdout.write(printed);
  }
};

function getThings(count: number): string {
  return count === 1 ? 'thing' : 'things';
}
