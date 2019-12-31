import { contextParallel, contextSerial } from './context-reporters';
import { runnerParallel, runnerSerial } from './runner-reporters';
import { runParallel, runSerial } from './run-reporters';

export * from './types';

export const parallelReporters = {
  context: contextParallel,
  runner: runnerParallel,
  run: runParallel
};

export const serialReporters = {
  context: contextSerial,
  runner: runnerSerial,
  run: runSerial
};
