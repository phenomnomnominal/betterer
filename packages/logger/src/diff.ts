import { diff, diffLinesUnified, diffStringsUnified } from 'jest-diff';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result',
  expand: false
};

/** @internal Definitely not stable! Please don't use! */
export function diffΔ<T>(expected: T, result: T): string | null {
  return diff(expected, result, DIFF_OPTIONS);
}

/** @internal Definitely not stable! Please don't use! */
export function diffStringsΔ(expected: string | null, result: string | null): string | null {
  const expectedStr = expected ?? '';
  const resultStr = result ?? '';

  // jest-diff recommends using diffLinesUnified if str lengths are above 20,000 for performance
  if (expectedStr.length > 20_000 || resultStr.length > 20_000) {
    return diffLinesUnified(expectedStr.split('\n'), resultStr.split('\n'), DIFF_OPTIONS);
  }

  return diffStringsUnified(expectedStr, resultStr, DIFF_OPTIONS);
}
