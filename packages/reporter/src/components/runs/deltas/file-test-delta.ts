import { BettererDelta } from '@betterer/betterer';

const formatter = Intl.NumberFormat();

export function fileTestDelta(delta: BettererDelta | null): string | null {
  if (!delta) {
    return '';
  }
  const { baseline, diff, result } = delta;
  const resultFormatted = formatter.format(result);
  if (diff === 0) {
    return ` (${resultFormatted} ${getIssuesStr(result)})`;
  }
  const diffIssues = getIssuesStr(diff);
  if (baseline != null && diff < 0) {
    const diffFormatted = formatter.format(-diff);
    return ` (${diffFormatted} fixed ${diffIssues}, ${resultFormatted} remaining)`;
  }
  if (baseline != null && diff > 0) {
    const diffFormatted = formatter.format(diff);
    return ` (${diffFormatted} new ${diffIssues}, ${resultFormatted} total)`;
  }
  return '';
}

function getIssuesStr(n: number): string {
  return Math.abs(n) === 1 ? 'issue' : 'issues';
}
