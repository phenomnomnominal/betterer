import { contextParallel, contextSerial } from './context-reporters';
import { runnerParallel } from './runner-reporters';
import { runSerial } from './run-reporters';

export * from './types';

export const parallelReporters = {
  context: contextParallel,
  runner: runnerParallel
};

export const serialReporters = {
  context: contextSerial,
  run: runSerial
};
