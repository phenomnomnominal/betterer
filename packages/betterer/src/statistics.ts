import { error, info, success, warn } from '@betterer/logger';

export type BettererStats = {
  obsolete: Array<string>;
  ran: Array<string>;
  failed: Array<string>;
  new: Array<string>;
  better: Array<string>;
  same: Array<string>;
  worse: Array<string>;
  completed: Array<string>;
};

export function initialise(): BettererStats {
  return {
    obsolete: [],
    ran: [],
    failed: [],
    new: [],
    better: [],
    same: [],
    worse: [],
    completed: []
  };
}

export function report(stats: BettererStats): void {
  const ran = stats.ran.length;
  const failed = stats.failed.length;
  const nnew = stats.new.length;
  const obsolete = stats.obsolete.length;
  const better = stats.better.length;
  const worse = stats.worse.length;
  const same = stats.same.length;
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
}

function getThings(count: number): string {
  return count === 1 ? 'thing' : 'things';
}
