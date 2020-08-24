import { BettererFiles } from './types';

export function goal(value: BettererFiles): boolean {
  return value.filesΔ.length === 0;
}
