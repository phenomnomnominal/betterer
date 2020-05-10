import { code, error, warn } from '@betterer/logger';

import { BettererRun } from '../../context';
import { BettererFileTest } from './file-test';

export function differ(run: BettererRun): void {
  const { diff } = run.test as BettererFileTest;
  Object.keys(diff).forEach((file) => {
    const issues = diff[file];
    if (issues.existing?.length) {
      const { length } = issues.existing;
      warn(`${length} existing ${getIssues(length)} in "${file}".`);
    }
    if (issues.neww?.length) {
      const { length } = issues.neww;
      error(`${length} new ${getIssues(length)} in "${file}":`);
      issues.neww.forEach((info) => code(info));
    }
  });
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
