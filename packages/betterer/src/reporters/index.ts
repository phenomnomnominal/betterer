import { contextSerial } from './context-reporters';
import { runnerParallel } from './runner-reporters';
import { runSerial } from './run-reporters';

export * from './types';

export const parallelReporters = {
  runner: runnerParallel
};

export const serialReporters = {
  context: contextSerial,
  run: runSerial
};
