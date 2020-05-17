import { BettererError, logError } from '@betterer/errors';
import { error, info, success, warn, logo } from '@betterer/logger';

import { BettererStats } from '../context';
import { BettererContextReporter } from './types';

export const contextParallel: BettererContextReporter = {
  start(): void {
    info('Running betterer in watch mode 🎉');
  },
  finish(): void {
    info('Stopping watch mode 👋');
  },
  error(error: BettererError, printed: Array<string>) {
    logError(error);
    process.stdout.write(printed.join(''));
  }
};

export const contextSerial: BettererContextReporter = {
  start(): void {
    logo();
  },
  finish(stats: BettererStats): void {
    const ran = stats.ran.length;
    const failed = stats.failed.length;
    const neww = stats.new.length;
    const obsolete = stats.obsolete.length;
    const better = stats.better.length;
    const worse = stats.worse.length;
    const same = stats.same.length;
    const skipped = stats.skipped.length;
    const { completed, expired } = stats;

    info(`${ran} ${getTests(ran)} got checked. 🤔`);
    if (expired) {
      expired.forEach((testName) => {
        error(`"${testName}" has passed its deadline. ☠️`);
      });
    }
    if (failed) {
      error(`${failed} ${getTests(failed)} failed to run. 🔥`);
    }
    if (neww) {
      info(`${neww} ${getTests(neww)} got checked for the first time! 🎉`);
    }
    if (obsolete) {
      info(`${obsolete} ${getTestsAre(obsolete)} are no longer needed! 🤪`);
    }
    if (better) {
      success(`${better} ${getTests(better)} got better! 😍`);
    }
    if (completed.length) {
      completed.forEach((testName) => {
        success(`"${testName}" met its goal! 🎉`);
      });
    }
    if (worse) {
      error(`${worse} ${getTests(worse)} got worse. 😔`);
    }
    if (same) {
      warn(`${same} ${getTests(same)} stayed the same. 😐`);
    }
    if (skipped) {
      warn(`${skipped} ${getTests(skipped)} got skipped. ❌`);
    }
  },
  error(error: BettererError, printed: Array<string>) {
    logError(error);
    process.stdout.write(printed.join(''));
  }
};

function getTests(count: number): string {
  return count === 1 ? 'test' : 'tests';
}

function getTestsAre(count: number): string {
  return `${getTests(count)} ${count === 1 ? 'is' : 'are'}`;
}
