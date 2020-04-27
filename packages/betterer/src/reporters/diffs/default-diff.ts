import * as logDiff from 'jest-diff';

const DIFF_OPTIONS = {
  aAnnotation: 'Previous',
  bAnnotation: 'Current',
};
const NEW_LINE = '\n';

export function defaultDiff(_: unknown, current: unknown, previous: unknown | null): void {
  const diffStr = logDiff(current, previous, DIFF_OPTIONS) || '';
  const lines = diffStr.split(NEW_LINE);
  lines.forEach((line) => {
    console.log(`  ${line}`);
  });
}
