export function testBetterΔ(context: string): string {
  return `${context} got better! 😍`;
}
export function testCheckedΔ(context: string): string {
  return `${context} got checked. 🤔`;
}
export function testCompleteΔ(context: string, isNew = false): string {
  return `${context}${isNew ? ' has already' : ''} met its goal! ${isNew ? '✨' : '🎉'}`;
}
export function testExpiredΔ(context: string): string {
  return `${context} has passed its deadline. ☠️`;
}
export function testFailedΔ(context: string): string {
  return `${context} failed to run. 🔥`;
}
export function testNewΔ(context: string): string {
  return `${context} got checked for the first time! 🎉`;
}
export function testObsoleteΔ(context: string): string {
  return `${context} no longer needed! 🤪`;
}
export function testRunningΔ(context: string): string {
  return `running ${context}!`;
}
export function testSameΔ(context: string): string {
  return `${context} stayed the same. 😐`;
}
export function testSkippedΔ(context: string): string {
  return `${context} got skipped. 🚫`;
}
export function testUpdatedΔ(context: string): string {
  return `${context} got force updated. 🆙`;
}
export function testWorseΔ(context: string): string {
  return `${context} got worse. 😔`;
}

export function updateInstructionsΔ(): string {
  return `Run \`betterer --update\` to force an update of the results file. 🆙`;
}

export function getTestsΔ(count: number): string {
  return `${count} ${count === 1 ? 'test' : 'tests'}`;
}

export function unexpectedDiffΔ(): string {
  return 'Unexpected diff found:';
}
