import { debug as debg } from '@betterer/logger';

export function debug(message: string | void): void {
  if (process.env.DEBUG && message) {
    debg(message);
  }
}

export const scorer = {
  addBetterer(author: string, addScore: number): string {
    return `"${author}" added Betterer to project: +${addScore} points`;
  },
  addTest(author: string, testName: string, addScore: number): string {
    return `"${author}" added test "${testName}": +${addScore} points`;
  },
  completeTest(author: string, testName: string, removeScore: number): string {
    return `"${author}" completed test "${testName}": +${removeScore} points`;
  },
  changeIssues(author: string, testName: string, changeScore: number): string | void {
    if (changeScore > 0) {
      return `"${author}" resolved issues from "${testName}": +${changeScore} points`;
    }
    if (changeScore < 0) {
      return `"${author}" added issues to "${testName}": ${changeScore} points`;
    }
  }
};
