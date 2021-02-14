export function testBetter(context: string): string {
  return `${context} got better! 😍`;
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
export function testNew(context: string): string {
  return `${context} got checked for the first time! 🎉`;
}
export function testObsolete(context: string): string {
  return `${context} no longer needed! 🤪`;
}
export function testRunning(context: string): string {
  return `running ${context}!`;
}
export function testSame(context: string): string {
  return `${context} stayed the same. 😐`;
}
export function testSkipped(context: string): string {
  return `${context} got skipped. 🚫`;
}
export function testUpdated(context: string): string {
  return `${context} got force updated. 🆙`;
}
export function testWorse(context: string): string {
  return `${context} got worse. 😔`;
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
