import type {
  BettererFileTestResult,
  BettererFileIssues,
  BettererFileTestResultSerialised,
  BettererFileBase
} from './types';

import * as path from 'path';

import { BettererFileResolverΩ } from '../../fs';
import { BettererFileTestResultΩ } from './file-test-result';

export function deserialise(serialised: BettererFileTestResultSerialised, resultsPath: string): BettererFileTestResult {
  const resolver = new BettererFileResolverΩ(path.dirname(resultsPath));
  const deserialised = new BettererFileTestResultΩ(resolver, resultsPath);
  Object.keys(serialised).map((key) => {
    const [relativePath, fileHash] = key.split(':');
    const issues = serialised[key].map((issue) => {
      const [line, column, length, message, hash] = issue;
      return { line, column, length, message, hash };
    });
    const absolutePath = resolver.resolve(relativePath);
    key = `${relativePath}:${fileHash}`;
    deserialised.addExpected({ absolutePath, key, hash: fileHash, issues });
  });
  return deserialised as BettererFileTestResult;
}

export function serialise(result: BettererFileTestResult): BettererFileTestResultSerialised {
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
    .reduce((serialised: BettererFileTestResultSerialised, file: BettererFileBase) => {
      serialised[file.key] = sortLinesAndColumns(file.issues).map((issue) => [
        issue.line,
        issue.column,
        issue.length,
        issue.message,
        issue.hash
      ]);
      return serialised;
    }, {} as BettererFileTestResultSerialised);
}

function sortLinesAndColumns(issues: BettererFileIssues): BettererFileIssues {
  return [...issues].sort((a, b) => (a.line !== b.line ? a.line - b.line : a.column - b.column));
}
