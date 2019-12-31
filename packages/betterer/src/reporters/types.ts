import { BettererContextReporter } from './context-reporters';
import { BettererRunnerReporter } from './runner-reporters';
import { BettererRunReporter } from './run-reporters';

export type BettererReporters = {
  context: BettererContextReporter;
  runner: BettererRunnerReporter;
  run: BettererRunReporter;
};
