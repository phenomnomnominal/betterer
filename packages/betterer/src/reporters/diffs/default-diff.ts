import * as logDiff from 'jest-diff';

import { NEW_LINE } from '../../constants';

const DIFF_OPTIONS = {
  aAnnotation: 'Previous',
  bAnnotation: 'Current'
};

export function defaultDiff(
  _: unknown,
  __: unknown,
  current: unknown,
  previous: unknown | null
): void {
  const diffStr = logDiff(current, previous, DIFF_OPTIONS) || '';
  const lines = diffStr.split(NEW_LINE);
  lines.forEach(line => {
    console.log(`  ${line}`);
  });
}
