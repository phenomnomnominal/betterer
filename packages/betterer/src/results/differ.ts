import logDiff from 'jest-diff';

import { BettererDiff } from './types';

const DIFF_OPTIONS = {
  aAnnotation: 'Result',
  bAnnotation: 'Expected'
};

const NEW_LINE = '\n';

export function defaultDiffer(expected: unknown, result: unknown): BettererDiff {
  return {
    expected,
    result,
    diff: null,
    log() {
      const diffStr = logDiff(result, expected, DIFF_OPTIONS) || '';
      const lines = diffStr.split(NEW_LINE);
      lines.forEach((line) => {
        process.stdout.write(`  ${line}`);
      });
    }
  };
}
