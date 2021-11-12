export function testBetter(context: string, delta = ''): string {
  return `${context} got better!${delta} 😍`;
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
export function testNew(context: string, delta = ''): string {
  return `${context} got checked for the first time!${delta} 🎉`;
}
export function testRunning(context: string): string {
  return `running ${context}!`;
}
export function testSame(context: string, delta = ''): string {
  return `${context} stayed the same.${delta} 😐`;
}
export function testSkipped(context: string, delta = ''): string {
  return `${context} got skipped.${delta} 🚫`;
}
export function testUpdated(context: string, delta = ''): string {
  return `${context} got force updated.${delta} 🆙`;
}
export function testWorse(context: string, delta = ''): string {
  return `${context} got worse.${delta} 😔`;
}

export function testsChanged(): string {
  return 'Your tests have changed, re-checking everything...\nThis could take a sec. ⏰';
}

export function updateInstructions(): string {
  return 'You should try to fix the new issues! As a last resort, you can run `betterer --update` to force an update of the results file. 🆙';
}

export function unexpectedChanges(): string {
  return 'Unexpected changes detected in these tests while running in CI mode:';
}

export function unexpectedChangesInstructions(): string {
  return 'You should make sure the results file is up-to-date before committing! You might want to run `betterer precommit` in a commit hook. 💍';
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
