import { contextSerial } from './context-reporters';
import { runSerial } from './run-reporters';

export * from './types';

export const parallelReporters = {};

export const serialReporters = {
  context: contextSerial,
  run: runSerial
};
