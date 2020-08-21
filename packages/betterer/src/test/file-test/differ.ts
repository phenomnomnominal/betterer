import { codeΔ, errorΔ, successΔ, warnΔ } from '@betterer/logger';
import * as assert from 'assert';

import { BettererRun } from '../../context';
import { BettererFileTest } from './file-test';

export function differ(run: BettererRun): void {
  const { diff } = run.test as BettererFileTest;
  assert(diff);
  Object.keys(diff).forEach((file) => {
    const issues = diff[file];
    const { existing, fixed } = issues;
    if (fixed?.length) {
      successΔ(`${fixed.length} fixed ${getIssues(fixed.length)} in "${file}".`);
    }
    if (existing?.length) {
      warnΔ(`${existing.length} existing ${getIssues(existing.length)} in "${file}".`);
    }
    if (issues.neww?.length) {
      const { length } = issues.neww;
      errorΔ(`${length} new ${getIssues(length)} in "${file}":`);
      issues.neww.forEach((info) => codeΔ(info));
    }
  });
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
