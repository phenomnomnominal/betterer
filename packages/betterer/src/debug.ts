export function debug(message: string | void): void {
  if (process.env.DEBUG && message) {
    process.stdout.write(`${message}\n`);
  }
}

export const scorer = {
  addBetterer(author: string, addScore: number): string {
    return `Author "${author}" added Betterer to project: +${addScore} points`;
  },
  addTest(author: string, testName: string, addScore: number): string {
    return `Author "${author}" added test "${testName}": +${addScore} points`;
  },
  removeTest(author: string, testName: string, removeScore: number): string {
    return `Author "${author}" removed test "${testName}": -${removeScore} points`;
  },
  changeIssues(author: string, testName: string, changeScore: number): string | void {
    if (changeScore > 0) {
      return `Author "${author}" resolved some issues from "${testName}": +${changeScore} points`;
    }
    if (changeScore < 0) {
      return `Author "${author}" added some issues to "${testName}": ${changeScore} points`;
    }
  }
};
