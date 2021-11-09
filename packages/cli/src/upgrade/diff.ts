import { diffStrings__ } from '@betterer/logger';
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
  return diffStrings__(before, after, DIFF_OPTIONS);
}
