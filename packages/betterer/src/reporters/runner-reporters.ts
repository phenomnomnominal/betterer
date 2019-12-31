export type BettererRunnerReporter = {
  start(): void;
  end(): void;
};

export const runnerParallel: BettererRunnerReporter = {
  start(): void {
    //
  },
  end(): void {
    //
  }
};

export const runnerSerial: BettererRunnerReporter = {
  start(): void {
    //
  },
  end(): void {
    //
  }
};
