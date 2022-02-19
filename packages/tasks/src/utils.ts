import { performance } from 'perf_hooks';

export function getTime(): number {
  return Date.now();
}

export function getPreciseTime(): number {
  return performance.now();
}
