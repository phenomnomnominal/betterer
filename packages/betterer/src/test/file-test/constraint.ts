import { ConstraintResult } from '@betterer/constraints';
import * as assert from 'assert';

import { BettererFiles } from './files';
import { ensureDeserialised } from './serialiser';
import { BettererFileTestDiff, BettererFileIssuesRaw, BettererFileIssueDeserialised } from './types';
import { BettererFile } from './file';

type BettererFileTestConstraintResult = {
  constraintResult: ConstraintResult;
  diff: BettererFileTestDiff;
};

export function constraint(current: BettererFiles, previous: BettererFiles): BettererFileTestConstraintResult {
  const diff = getDiff(current, previous);

  const filePaths = Object.keys(diff);

  if (filePaths.length === 0) {
    return { constraintResult: ConstraintResult.same, diff };
  }

  const hasNew = filePaths.filter((filePath) => {
    return !!diff[filePath].neww?.length;
  });

  if (hasNew.length) {
    return { constraintResult: ConstraintResult.worse, diff };
  }

  const hasFixed = filePaths.filter((filePath) => {
    return !!diff[filePath].fixed;
  });

  if (hasFixed.length) {
    return { constraintResult: ConstraintResult.better, diff };
  }

  return { constraintResult: ConstraintResult.same, diff };
}

function getDiff(current: BettererFiles, previous: BettererFiles): BettererFileTestDiff {
  // Find all files that exist in both current and previous:
  const unchangedPreviousFiles: Array<BettererFile> = [];
  const unchangedCurrentFiles = current.files.filter((c) => {
    const previousFile = previous.files.find((p) => {
      return p.hash === c.hash && p.filePath === c.filePath;
    });
    if (previousFile) {
      unchangedPreviousFiles.push(previousFile);
    }
    return !!previousFile;
  });

  // Any current files that aren't in previous are either new, have been moved, or have been changed:
  const newOrMovedOrChangedFiles = current.files.filter((c) => !unchangedCurrentFiles.includes(c));
  // And previous files that aren't in current are either fixed, have been moved, or have been changed:
  const fixedOrMovedOrChangedFiles = previous.files.filter((c) => !unchangedPreviousFiles.includes(c));

  // We can find the moved files by matching the file hashes:
  fixedOrMovedOrChangedFiles.forEach((fixedOrMovedOrChangedFile, index) => {
    // A file may have been moved it has the same hash in both current and previous
    const possibilities = newOrMovedOrChangedFiles.filter(
      (newOrMovedOrChangedFile) => newOrMovedOrChangedFile.hash === fixedOrMovedOrChangedFile.hash
    );
    if (!possibilities.length) {
      return;
    }
    const best = possibilities.shift();
    if (best) {
      // Remove the moved file from the fixedOrMovedOrChangedFiles array:
      fixedOrMovedOrChangedFiles.splice(index, 1);
      // And from the newOrMovedOrChangedFiles array:
      newOrMovedOrChangedFiles.splice(newOrMovedOrChangedFiles.indexOf(best), 1);
    }
  });

  // Leaving us with the files that are new or changed:
  const newOrChangedFiles = newOrMovedOrChangedFiles;
  // And fixed or changed:
  const fixedOrChangedFiles = fixedOrMovedOrChangedFiles;

  const filesWithChanges = [...newOrChangedFiles, ...fixedOrChangedFiles];

  // If there are no new, fixed, or changed files, there's nothing to diff:
  if (filesWithChanges.length === 0) {
    return {};
  }

  const diff = {} as BettererFileTestDiff;
  filesWithChanges.forEach((file) => {
    const { filePath } = file;
    const currentFile = current.getFile(filePath);
    const previousFile = previous.getFile(filePath);

    // If a file exists in the previous and not the current then all the issues are fixed:
    if (!currentFile) {
      assert(previousFile);
      diff[filePath] = {
        fixed: previousFile.issues.length
      };
      return;
    }

    // If a file exists in the current and not the previous then all the issues are new:
    if (!previousFile) {
      assert(currentFile);
      diff[filePath] = {
        neww: currentFile.issues as BettererFileIssuesRaw
      };
      return;
    }

    // Convert all issues to their deserialised form for easier diffing:
    const currentIssues = [...ensureDeserialised(currentFile.issues)];
    const previousIssues = ensureDeserialised(previousFile.issues);

    // Find all issues that exist in both current and previous:
    const unchangedPreviousIssues: Array<BettererFileIssueDeserialised> = [];
    const unchangedCurrentIssues = currentIssues.filter((c) => {
      const previousIssue = previousIssues.find((p) => {
        return p.hash === c.hash && p.line === c.line && p.column === c.column && p.length === c.length;
      });
      if (previousIssue) {
        unchangedPreviousIssues.push(previousIssue);
      }
      return !!previousIssue;
    });

    // Any current issues that aren't in previous are either new or have been moved:
    const newOrMovedIssues = currentIssues.filter((c) => !unchangedCurrentIssues.includes(c));
    // Any previous issues that aren't in current are either fixed or have been moved:
    const fixedOrMovedIssues = previousIssues.filter((c) => !unchangedPreviousIssues.includes(c));

    // We can find the moved issues by matching the issue hashes:
    const movedIssues: Array<BettererFileIssueDeserialised> = [];
    fixedOrMovedIssues.forEach((fixedOrMovedIssue, index) => {
      const { hash, line, column } = fixedOrMovedIssue;
      // An issue may have been moved it has the same hash in both current and previous
      const possibilities = newOrMovedIssues.filter((newOrMovedIssue) => newOrMovedIssue.hash === hash);
      if (!possibilities.length) {
        return;
      }
      // Start by marking the first possibility as best:
      let best = possibilities.shift();

      // And then search through all the possibilities to find the closest issue:
      possibilities.forEach((possibility) => {
        assert(best);
        if (Math.abs(line - possibility.line) > Math.abs(line - best.line)) {
          return;
        }
        if (Math.abs(line - possibility.line) < Math.abs(line - best.line)) {
          best = possibility;
        }
        if (Math.abs(column - possibility.column) > Math.abs(column - best.column)) {
          return;
        }
        if (Math.abs(column - possibility.column) < Math.abs(column - best.column)) {
          best = possibility;
        }
      });

      assert(best);
      // Remove the moved issue from the fixedOrMovedIssues array:
      fixedOrMovedIssues.splice(index, 1);
      // Remove the moved issue from the newOrMovedIssues array:
      newOrMovedIssues.splice(newOrMovedIssues.indexOf(best), 1);
      // And add the moved issue to the movedIssues array:
      movedIssues.push(best);
    });

    // Find the raw issue data so that diffs can be logged:
    const newIssues = newOrMovedIssues.map((newIssue) => currentFile.issues[currentIssues.indexOf(newIssue)]);
    const fixedIssues = fixedOrMovedIssues;

    // And finally construct the diff:
    diff[file.filePath] = {
      existing: unchangedPreviousIssues.length + movedIssues.length,
      neww: newIssues as BettererFileIssuesRaw,
      fixed: fixedIssues.length
    };
  });

  return diff;
}
