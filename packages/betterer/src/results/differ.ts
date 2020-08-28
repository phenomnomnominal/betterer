import { diffΔ } from '@betterer/logger';
import { BettererDiff } from './types';

export function defaultDiffer(expected: unknown, result: unknown): BettererDiff {
  return {
    expected,
    result,
    diff: null,
    log() {
      diffΔ(expected, result);
    }
  };
}
