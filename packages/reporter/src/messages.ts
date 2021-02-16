import { BettererDelta } from '@betterer/betterer';

export function testBetter(context: string, delta?: BettererDelta | null): string {
  return `${context} got better!${getBetterProgress(delta)} 😍`;
}
export function testChecked(context: string): string {
  return `${context} got checked. 🤔`;
}
export function testComplete(context: string, isNew = false): string {
  return `${context}${isNew ? ' has already' : ''} met its goal! ${isNew ? '✨' : '🎉'}`;
}
export function testExpired(context: string): string {
  return `${context} has passed its deadline. 👻`;
}
export function testFailed(context: string): string {
  return `${context} failed to run. 🔥`;
}
export function testNew(context: string, delta?: BettererDelta | null): string {
  return `${context} got checked for the first time!${getRemaining(delta)} 🎉`;
}
export function testObsolete(context: string): string {
  return `${context} no longer needed! 🤪`;
}
export function testRunning(context: string): string {
  return `running ${context}!`;
}
export function testSame(context: string, delta?: BettererDelta | null): string {
  return `${context} stayed the same.${getRemaining(delta)} 😐`;
}
export function testSkipped(context: string, delta?: BettererDelta | null): string {
  return `${context} got skipped.${getRemaining(delta)} 🚫`;
}
export function testUpdated(context: string, delta?: BettererDelta | null): string {
  return `${context} got force updated.${getWorseProgress(delta)} 🆙`;
}
export function testWorse(context: string, delta?: BettererDelta | null): string {
  return `${context} got worse.${getWorseProgress(delta)} 😔`;
}

export function updateInstructions(): string {
  return `Run \`betterer --update\` to force an update of the results file. 🆙`;
}

export function unexpectedDiff(): string {
  return 'Unexpected diff found:';
}

export function filesChecking(files: number): string {
  return `Checking ${files} ${getFiles(files)}... 🤔`;
}

export function filesChecked(files: number): string {
  return `Checked ${files} ${getFiles(files)}! 🔍`;
}

export function watchStart(): string {
  return 'Starting Betterer in watch mode! 🎉';
}

export function watchEnd(): string {
  return 'Stopping watch mode... 👋';
}

function getFiles(count: number): string {
  return count === 1 ? 'file' : 'files';
}

const formatter = Intl.NumberFormat();

function getRemaining(delta?: BettererDelta | null): string {
  if (!delta) {
    return '';
  }
  const { baseline, diff, result } = delta;
  return ` (${getDiff(result, baseline, diff)})`;
}

function getBetterProgress(delta?: BettererDelta | null): string {
  if (!delta || !delta.diff) {
    return '';
  }
  const { baseline, diff, percentage, result } = delta;
  return ` (${getDiff(result, baseline, diff)}, ${percentage.toFixed(2)}% better)`;
}

function getWorseProgress(delta?: BettererDelta | null): string {
  if (!delta || !delta.diff) {
    return '';
  }
  const { baseline, diff, percentage, result } = delta;
  return ` (${getDiff(result, baseline, diff)}, ${(-percentage).toFixed(2)}% worse`;
}

function getDiff(result: number, baseline: number | null, diff: number | null): string {
  if (!baseline || !diff || diff === 0) {
    return `now: ${formatter.format(result)}`;
  }
  const sign = diff > 0 ? '+' : '';
  return `was: ${formatter.format(baseline)}, now: ${formatter.format(result)}, diff: ${sign}${formatter.format(diff)}`;
}
