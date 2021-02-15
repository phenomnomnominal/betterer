import { BettererProgress } from '@betterer/betterer';

export function testBetter(context: string, progress?: BettererProgress | null): string {
  return `${context} got better!${getBetterProgress(progress)} 😍`;
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
export function testNew(context: string, progress?: BettererProgress | null): string {
  return `${context} got checked for the first time!${getRemaining(progress)} 🎉`;
}
export function testObsolete(context: string): string {
  return `${context} no longer needed! 🤪`;
}
export function testRunning(context: string): string {
  return `running ${context}!`;
}
export function testSame(context: string, progress?: BettererProgress | null): string {
  return `${context} stayed the same.${getRemaining(progress)} 😐`;
}
export function testSkipped(context: string, progress?: BettererProgress | null): string {
  return `${context} got skipped.${getRemaining(progress)} 🚫`;
}
export function testUpdated(context: string, progress?: BettererProgress | null): string {
  return `${context} got force updated.${getWorseProgress(progress)} 🆙`;
}
export function testWorse(context: string, progress?: BettererProgress | null): string {
  return `${context} got worse.${getWorseProgress(progress)} 😔`;
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

function getRemaining(progress?: BettererProgress | null): string {
  if (!progress) {
    return '';
  }
  return ` (${getDiff(progress)})`;
}

function getBetterProgress(progress?: BettererProgress | null): string {
  if (!progress) {
    return '';
  }
  const { percentage } = progress;
  return ` (${getDiff(progress)}, ${percentage.toFixed(2)}% better)`;
}

function getWorseProgress(progress?: BettererProgress | null): string {
  if (!progress) {
    return '';
  }
  const { percentage } = progress;
  return ` (${getDiff(progress)}, ${(-percentage).toFixed(2)}% worse`;
}

function getDiff(progress?: BettererProgress | null): string {
  if (!progress) {
    return '';
  }
  const { baseline, result } = progress;
  return ` was: ${formatter.format(baseline)}, now: ${formatter.format(result)}`;
}
