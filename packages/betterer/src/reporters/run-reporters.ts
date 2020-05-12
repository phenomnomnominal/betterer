import { br, error, info, success, warn } from '@betterer/logger';

import { BettererRun } from '../context';
import { diff } from '../results';
import { BettererRunReporter } from './types';

export const runSerial: BettererRunReporter = {
  better(run: BettererRun): void {
    const { isComplete, name } = run;
    if (isComplete) {
      success(`"${name}" met its goal! 🎉`);
      return;
    }
    success(`"${name}" got better! 😍`);
  },
  failed(run: BettererRun): void {
    error(`"${run.name}" failed to run. 🔥`);
  },
  neww(run: BettererRun): void {
    const { isComplete, name } = run;
    if (isComplete) {
      success(`"${name}" has already met its goal! ✨`);
      return;
    }
    success(`"${name}" got checked for the first time! 🎉`);
  },
  same(run: BettererRun): void {
    const { name } = run;
    warn(`"${name}" stayed the same. 😐`);
  },
  start(run: BettererRun): void {
    info(`running "${run.name}"!`);
  },
  worse(run: BettererRun): void {
    const { name } = run;
    error(`"${name}" got worse. 😔`);
    br();
    diff(run);
    br();
  }
};
