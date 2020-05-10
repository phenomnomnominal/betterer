import { ConstraintResult } from '@betterer/constraints';

import { resultToDeserialiseIssue } from './serialiser';
import {
  BettererFilesResult,
  BettererFilesDeserialised,
  BettererFileTestDiff,
  BettererFileIssue,
  BettererFileIssueDeserialised
} from './types';

type BettererFileTestConstraintResult =
  | {
      constraintResult: ConstraintResult.worse;
      diff: BettererFileTestDiff;
    }
  | {
      constraintResult: ConstraintResult.same | ConstraintResult.better;
      diff?: never;
    };

export function constraint(
  current: BettererFilesResult,
  previous: BettererFilesDeserialised
): BettererFileTestConstraintResult {
  const currentFilePaths = current.filePaths;
  const previousFilePaths = previous.filePaths;

  const newOrMovedUnchangedFiles = currentFilePaths.filter((file) => {
    return !previousFilePaths.includes(file);
  });
  const movedUnchangedFiles = newOrMovedUnchangedFiles.filter((file) => {
    const fileHash = current.getFileHash(file);
    return previous.hasHash(fileHash);
  });
  const newFiles = newOrMovedUnchangedFiles.filter((file) => {
    return !movedUnchangedFiles.includes(file);
  });
  const existingFiles = currentFilePaths.filter((file) => {
    return !newOrMovedUnchangedFiles.includes(file);
  });

  // If there are any new files with issues, then it's worse:
  if (newFiles.length > 0) {
    return { constraintResult: ConstraintResult.worse, diff: getDiff(current, previous) };
  }

  const filesWithMore = existingFiles.filter((filePath) => {
    const currentIssues = current.getFileIssues(filePath);
    const previousIssues = previous.getFileIssues(filePath);
    return currentIssues.length > previousIssues.length;
  });

  // If any file has more entries, then it's worse:
  if (filesWithMore.length > 0) {
    return { constraintResult: ConstraintResult.worse, diff: getDiff(current, previous) };
  }

  const filesWithSame = existingFiles.filter((filePath) => {
    const currentIssues = current.getFileIssues(filePath);
    const previousIssues = previous.getFileIssues(filePath);
    return currentIssues.length === previousIssues.length;
  });

  // If all the files have the same number of entries as before, then it's the same:
  const unchangedFiles = [...filesWithSame, ...movedUnchangedFiles];
  if (unchangedFiles.length === previousFilePaths.length) {
    return { constraintResult: ConstraintResult.same };
  }

  // If all the files have the same number of entries as before or fewer, then it's better!
  return { constraintResult: ConstraintResult.better };
}

function getDiff(current: BettererFilesResult, previous: BettererFilesDeserialised): BettererFileTestDiff {
  const filesWithChanges = current.files.filter((file) => {
    const { filePath } = file;
    const currentIssues = current.getFileIssues(filePath).map(resultToDeserialiseIssue);
    const previousIssues = previous.getFileIssues(filePath);
    if (!currentIssues || !previousIssues || currentIssues.length !== previousIssues.length) {
      return true;
    }
    return currentIssues.some((c, index) => {
      const p = previousIssues[index];
      return p.line !== c.line || p.column !== c.column || p.length !== c.length;
    });
  });

  const diff = filesWithChanges.reduce((d, file) => {
    const { filePath } = file;
    const currentIssues = current.getFileIssues(filePath).map(resultToDeserialiseIssue);
    const previousIssues = previous.getFileIssues(file.filePath);
    const existingIssues = file.fileIssues.filter((_, index) => {
      const c = currentIssues[index];
      return !!previousIssues?.find((p) => {
        return p.hash === c.hash && p.line === c.line && p.column === c.column && p.length === c.length;
      });
    });
    const movedIssues: Array<BettererFileIssue> = [];
    previousIssues.forEach((p) => {
      const possibilities = currentIssues.filter((c) => {
        return p.hash === c.hash;
      });
      const bestPossibility = possibilities.reduce((b, n) => {
        if (!b) {
          return n;
        }
        if (Math.abs(p.line - n.line) > Math.abs(p.line - b.line)) {
          return b;
        }
        if (Math.abs(p.line - n.line) < Math.abs(p.line - b.line)) {
          return n;
        }
        if (Math.abs(p.column - n.column) > Math.abs(p.column - b.column)) {
          return b;
        }
        if (Math.abs(p.column - n.column) < Math.abs(p.column - b.column)) {
          return n;
        }
        return b;
      }, null as BettererFileIssueDeserialised | null);
      if (bestPossibility) {
        const issue = file.fileIssues[currentIssues.indexOf(bestPossibility)];
        existingIssues.splice(existingIssues.indexOf(issue), 1);
        movedIssues.push(issue);
      }
    });
    const newIssues = file.fileIssues.filter((issue) => {
      return !existingIssues.includes(issue) && !movedIssues.includes(issue);
    });
    d[file.filePath] = {
      existing: [...existingIssues, ...movedIssues],
      neww: newIssues
    };
    return d;
  }, {} as BettererFileTestDiff);

  return diff;
}
