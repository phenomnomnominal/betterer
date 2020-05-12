import LinesAndColumns from 'lines-and-columns';
import { createHash } from '../../hasher';
import { BettererFile } from './file';
import { BettererFiles } from './files';
import {
  BettererFileIssuesMapSerialised,
  BettererFileIssues,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised,
  BettererFileIssuesSerialised,
  BettererFileIssueRaw
} from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export function deserialise(serialised: BettererFileIssuesMapSerialised): BettererFiles {
  return new BettererFiles(
    Object.keys(serialised).map((key) => {
      const [filePath, hash] = key.split(':');
      const issues = serialised[key].map((issue) => {
        const [line, column, length, message, hash] = issue;
        return { line, column, length, message, hash };
      });
      return new BettererFile(filePath, hash, issues);
    })
  );
}

export function serialise(result: BettererFiles): BettererFileIssuesMapSerialised {
  return result.files.reduce((serialised: BettererFileIssuesMapSerialised, file: BettererFile) => {
    serialised[file.key] = serialiseDeserialised(sortLinesAndColumns(ensureDeserialised(file.issues)));
    return serialised;
  }, {} as BettererFileIssuesMapSerialised);
}

export function ensureDeserialised(issues: BettererFileIssues): BettererFileIssuesDeserialised {
  return isRaw(issues) ? rawToDeserialiseIssue(issues) : [...issues];
}

function isRaw(issues: BettererFileIssues): issues is BettererFileIssuesRaw {
  const [issue] = issues;
  return (issue as BettererFileIssueRaw).fileText != null;
}

function rawToDeserialiseIssue(issues: BettererFileIssuesRaw): BettererFileIssuesDeserialised {
  return issues.map((issue) => {
    const { fileText, start, end, message } = issue;
    const lc = new LinesAndColumns(fileText);
    const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
    const length = end - start;
    const hash = issue.hash || createHash(fileText.substr(start, length));
    return { line, column, length, message, hash };
  });
}

function serialiseDeserialised(issues: BettererFileIssuesDeserialised): BettererFileIssuesSerialised {
  return issues.map((issue) => {
    const { line, column, length, message, hash } = issue;
    return [line, column, length, message, hash];
  });
}

function sortLinesAndColumns(issues: BettererFileIssuesDeserialised): BettererFileIssuesDeserialised {
  return [...issues].sort((a, b) => (a.line !== b.line ? a.line - b.line : a.column - b.column));
}
