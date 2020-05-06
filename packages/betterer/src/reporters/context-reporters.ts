import { BettererError, logError } from '@betterer/errors';
import { error, info, success, warn, logo } from '@betterer/logger';

import { BettererContext } from '../context';
import { BettererContextReporter } from './types';

export const contextParallel: BettererContextReporter = {
  start(): void {
    info('Running betterer in watch mode 🎉');
  },
  finish(): void {
    info('Stopping watch mode 👋');
  }
};

export const contextSerial: BettererContextReporter = {
  start(): void {
    logo();
  },
  finish(context: BettererContext): void {
    const { stats } = context;
    const ran = stats.ran.length;
    const failed = stats.failed.length;
    const neww = stats.new.length;
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
    if (neww) {
      info(`${neww} ${getThings(neww)} got checked for the first time! 🎉`);
    }
    if (obsolete) {
      info(`${obsolete} ${getThings(obsolete)} are no longer needed! 🤪`);
    }
    if (better) {
      success(`${better} ${getThings(better)} got better! 😍`);
    }
    if (completed.length) {
      completed.forEach((testName) => {
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
  error(error: BettererError, printed: Array<string>) {
    logError(error);
    process.stdout.write(printed.join(''));
  }
};

function getThings(count: number): string {
  return count === 1 ? 'thing' : 'things';
}
