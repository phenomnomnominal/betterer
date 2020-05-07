import logDiff from 'jest-diff';

import { BettererRun } from '../context';

export function diff(run: BettererRun): unknown {
  const { test } = run;
  const differ = test.differ || defaultDiff;
  return differ(run);
}

const DIFF_OPTIONS = {
  aAnnotation: 'Result',
  bAnnotation: 'Expected'
};
const NEW_LINE = '\n';

function defaultDiff(run: BettererRun): void {
  const { expected, result } = run;
  const diffStr = logDiff(result, expected, DIFF_OPTIONS) || '';
  const lines = diffStr.split(NEW_LINE);
  lines.forEach((line) => {
    console.log(`  ${line}`);
  });
}
