import { diff } from 'jest-diff';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

/** @internal Definitely not stable! Please don't use! */
export function diffΔ<T>(expected: T, result: T): string | null {
  return diff(expected, result, DIFF_OPTIONS);
}
