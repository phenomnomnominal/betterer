import { diffStrings__ } from '@betterer/logger';
import chalk from 'chalk';

const DIFF_OPTIONS = {
  aAnnotation: 'Before',
  aIndicator: '-',
  aColor: chalk.gray,
  bAnnotation: 'After',
  bColor: chalk.greenBright,
  bIndicator: '+',
  expand: true
};

export function diff(before: string, after: string): string {
  return diffStrings__(before, after, DIFF_OPTIONS);
}
