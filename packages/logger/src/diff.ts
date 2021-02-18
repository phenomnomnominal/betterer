import logDiff from 'jest-diff';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

/** @internal Definitely not stable! Please don't use! */
export function diffΔ<T>(expected: T, result: T): string | null {
  return logDiff(expected, result, DIFF_OPTIONS);
}
