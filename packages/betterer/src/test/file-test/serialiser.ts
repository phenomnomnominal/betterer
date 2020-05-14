import LinesAndColumns from 'lines-and-columns';
import { createHash } from '../../hasher';
import { BettererFile } from './file';
import { BettererFiles } from './files';
import {
  BettererFileIssuesMapSerialised,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised,
  BettererFileIssuesSerialised
} from './types';
import { BettererRun } from '../../context';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export function deserialise(run: BettererRun, serialised: BettererFileIssuesMapSerialised): BettererFiles {
  return new BettererFiles(
    Object.keys(serialised).map((key) => {
      const [relativePath, hash] = key.split(':');
      const issues = serialised[key].map((issue) => {
        const [line, column, length, message, hash] = issue;
        return { line, column, length, message, hash };
      });
      const absolutePath = run.context.getAbsolutePath(relativePath);
      return new BettererFile(relativePath, absolutePath, hash, issues);
    })
  );
}

export function serialise(_: BettererRun, result: BettererFiles): BettererFileIssuesMapSerialised {
  return result.files.reduce((serialised: BettererFileIssuesMapSerialised, file: BettererFile) => {
    serialised[file.key] = serialiseDeserialised(sortLinesAndColumns(ensureDeserialised(file)));
    return serialised;
  }, {} as BettererFileIssuesMapSerialised);
}

export function ensureDeserialised(file: BettererFile): BettererFileIssuesDeserialised {
  try {
    return file.issuesDeserialised;
  } catch {
    return rawToDeserialiseIssue(file.issuesRaw);
  }
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
