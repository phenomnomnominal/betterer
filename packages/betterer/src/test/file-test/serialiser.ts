import type {
  BettererFileBase,
  BettererFileIssues,
  BettererFileTestResult,
  BettererFileTestResultKey,
  BettererFileTestResultKeyParts,
  BettererFileTestResultSerialised
} from './types.js';

import { BettererError } from '@betterer/errors';
import path from 'node:path';

import { BettererFileResolverΩ } from '../../fs/index.js';
import { BettererFileTestResultΩ } from './file-test-result.js';

export function deserialise(serialised: BettererFileTestResultSerialised, resultsPath: string): BettererFileTestResult {
  const resolver = new BettererFileResolverΩ(path.dirname(resultsPath));
  const deserialised = new BettererFileTestResultΩ(resolver, resultsPath);
  Object.keys(serialised)
    .filter(isKey)
    .map((key) => {
      const { relativePath, hash } = splitKey(key);
      const issuesForFile = serialised[key] ?? [];
      const issues = issuesForFile.map((issue) => {
        const [line, column, length, message, hash] = issue;
        return { line, column, length, message, hash };
      });
      const absolutePath = resolver.resolve(relativePath);
      key = `${relativePath}:${hash}`;
      deserialised.addExpected({ absolutePath, key, hash, issues });
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
    .reduce<BettererFileTestResultSerialised>(
      (serialised: BettererFileTestResultSerialised, file: BettererFileBase) => {
        serialised[file.key] = sortLinesAndColumns(file.issues).map((issue) => [
          issue.line,
          issue.column,
          issue.length,
          issue.message,
          issue.hash
        ]);
        return serialised;
      },
      {}
    );
}

function sortLinesAndColumns(issues: BettererFileIssues): BettererFileIssues {
  return [...issues].sort((a, b) => (a.line !== b.line ? a.line - b.line : a.column - b.column));
}

export function isKey(key: string): key is BettererFileTestResultKey {
  return /.*:.*/.test(key);
}

function splitKey(key: BettererFileTestResultKey): BettererFileTestResultKeyParts {
  const [relativePath, hash] = key.split(':');
  const parts = { relativePath, hash };
  assertsKey(parts);
  return parts;
}

function assertsKey(key: Partial<BettererFileTestResultKeyParts>): asserts key is BettererFileTestResultKeyParts {
  if (key.hash == null || key.relativePath == null) {
    throw new BettererError('Invalid serialised key parts, cannot deserialise. ❌');
  }
}
