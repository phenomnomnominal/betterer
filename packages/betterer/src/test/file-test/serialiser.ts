import LinesAndColumns from 'lines-and-columns';
import { getConfig } from '../../config';
import { createHash } from '../../hasher';
import { getAbsolutePath } from '../../utils';
import { BettererFileΩ } from './file';
import { BettererFilesΩ } from './files';
import {
  BettererFile,
  BettererFileIssuesMapSerialised,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised,
  BettererFileIssuesSerialised
} from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export function deserialise(serialised: BettererFileIssuesMapSerialised): BettererFilesΩ {
  return new BettererFilesΩ(
    Object.keys(serialised).map((key) => {
      const [relativePath, hash] = key.split(':');
      const issues = serialised[key].map((issue) => {
        const [line, column, length, message, hash] = issue;
        return { line, column, length, message, hash };
      });
      const { resultsPath } = getConfig();
      const absolutePath = getAbsolutePath(resultsPath, relativePath);
      return new BettererFileΩ(relativePath, absolutePath, hash, issues);
    })
  );
}

export function serialise(result: BettererFilesΩ): BettererFileIssuesMapSerialised {
  return result.filesΔ.reduce((serialised: BettererFileIssuesMapSerialised, file: BettererFile) => {
    serialised[file.key] = serialiseDeserialised(sortLinesAndColumns(file.issues));
    return serialised;
  }, {} as BettererFileIssuesMapSerialised);
}

export function rawToDeserialiseIssue(issues: BettererFileIssuesRaw): BettererFileIssuesDeserialised {
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
