import { getAbsolutePath } from '../../utils';
import { BettererFileTestResultΩ } from './file-test-result';
import { BettererFileTestResult, BettererFileIssues, BettererFileIssuesMapSerialised, BettererFileBase } from './types';

export function deserialise(serialised: BettererFileIssuesMapSerialised, resultsPath: string): BettererFileTestResult {
  const deserialised = new BettererFileTestResultΩ();
  Object.keys(serialised).map((key) => {
    const [relativePath, fileHash] = key.split(':');
    const issues = serialised[key].map((issue) => {
      const [line, column, length, message, hash] = issue;
      return { line, column, length, message, hash };
    });
    const absolutePath = getAbsolutePath(resultsPath, relativePath);
    key = `${absolutePath}:${fileHash}`;
    deserialised.addExpected({ absolutePath, key, hash: fileHash, issues });
  });
  return deserialised;
}

export function serialise(result: BettererFileTestResult): BettererFileIssuesMapSerialised {
  const resultΩ = result as BettererFileTestResultΩ;
  return resultΩ.files
    .filter((file) => file.issues.length)
    .sort((fileA, fileB) => {
      if (fileA.absolutePath < fileB.absolutePath) {
        return -1;
      }
      if (fileA.absolutePath > fileB.absolutePath) {
        return 1;
      }
      return 0;
    })
    .reduce((serialised: BettererFileIssuesMapSerialised, file: BettererFileBase) => {
      serialised[file.key] = sortLinesAndColumns(file.issues).map((issue) => [
        issue.line,
        issue.column,
        issue.length,
        issue.message,
        issue.hash
      ]);
      return serialised;
    }, {} as BettererFileIssuesMapSerialised);
}

function sortLinesAndColumns(issues: BettererFileIssues): BettererFileIssues {
  return [...issues].sort((a, b) => (a.line !== b.line ? a.line - b.line : a.column - b.column));
}
