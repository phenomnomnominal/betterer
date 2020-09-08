import { getConfig } from '../../config';
import { getAbsolutePath } from '../../utils';
import { BettererFilesΩ } from './files';
import { BettererFiles, BettererFileIssues, BettererFileIssuesMapSerialised, BettererFileBase } from './types';

export function deserialise(serialised: BettererFileIssuesMapSerialised): BettererFiles {
  const deserialised = new BettererFilesΩ();
  Object.keys(serialised).map((key) => {
    const [relativePath, fileHash] = key.split(':');
    const issues = serialised[key].map((issue) => {
      const [line, column, length, message, hash] = issue;
      return { line, column, length, message, hash };
    });
    const { resultsPath } = getConfig();
    const absolutePath = getAbsolutePath(resultsPath, relativePath);
    deserialised.addExpectedIssues({ absolutePath, key, hash: fileHash, issues });
  });
  return deserialised;
}

export function serialise(result: BettererFiles): BettererFileIssuesMapSerialised {
  const resultΩ = result as BettererFilesΩ;
  return resultΩ.files
    .filter((file) => file.issues.length)
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
