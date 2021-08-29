import { diffLinesUnified, diffStringsUnified } from 'jest-diff';
import { greenBright, gray } from 'chalk';

const DIFF_OPTIONS = {
  aAnnotation: 'Before',
  aIndicator: '-',
  aColor: gray,
  bAnnotation: 'After',
  bColor: greenBright,
  bIndicator: '+',
  expand: true
};

export function diff(before: string, after: string): string {
  // jest-diff recommends using diffLinesUnified if str lengths are above 20,000 for performance
  if (before.length > 20_000 || after.length > 20_000) {
    return diffLinesUnified(before.split('\n'), after.split('\n'), DIFF_OPTIONS);
  }

  return diffStringsUnified(before, after, DIFF_OPTIONS);
}
