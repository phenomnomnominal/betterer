import { ConstraintResult } from '@betterer/constraints';
import * as assert from 'assert';

import { BettererFile } from './file';
import { BettererFiles } from './files';
import { ensureDeserialised } from './serialiser';
import { BettererFileTestDiff, BettererFileIssuesRaw, BettererFileIssueDeserialised } from './types';

type BettererFileTestConstraintResult = {
  constraintResult: ConstraintResult;
  diff: BettererFileTestDiff;
};

export function constraint(result: BettererFiles, expected: BettererFiles): BettererFileTestConstraintResult {
  const diff = getDiff(result, expected);

  const filePaths = Object.keys(diff);

  if (filePaths.length === 0) {
    return { constraintResult: ConstraintResult.same, diff };
  }

  const hasNew = filePaths.filter((filePath) => !!diff[filePath].neww?.length);

  if (hasNew.length) {
    return { constraintResult: ConstraintResult.worse, diff };
  }

  const hasFixed = filePaths.filter((filePath) => !!diff[filePath].fixed?.length);

  if (hasFixed.length) {
    return { constraintResult: ConstraintResult.better, diff };
  }

  return { constraintResult: ConstraintResult.same, diff };
}

function getDiff(result: BettererFiles, expected: BettererFiles): BettererFileTestDiff {
  // Find all files that exist in both result and expected:
  const unchangedExpectedFiles: Array<BettererFile> = [];
  const unchangedResultFiles = result.files.filter((r) => {
    const expectedFile = expected.files.find((e) => {
      return e.hash === r.hash && e.absolutePath === r.absolutePath;
    });
    if (expectedFile) {
      unchangedExpectedFiles.push(expectedFile);
    }
    return !!expectedFile;
  });

  // Any result files that aren't in expected are either new, have been moved, or have been changed:
  const newOrMovedOrChangedFiles = result.files.filter((r) => !unchangedResultFiles.includes(r));
  // And expected files that aren't in result are either fixed, have been moved, or have been changed:
  const fixedOrMovedOrChangedFiles = expected.files.filter((e) => !unchangedExpectedFiles.includes(e));

  // We can find the moved files by matching the file hashes:
  fixedOrMovedOrChangedFiles.forEach((fixedOrMovedOrChangedFile, index) => {
    // A file may have been moved it has the same hash in both result and expected
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
    const { absolutePath, relativePath } = file;
    const resultFile = result.getFile(absolutePath);
    const expectedFile = expected.getFile(absolutePath);

    // If a file exists in the expected and not the result then all the issues are fixed:
    if (!resultFile) {
      assert(expectedFile);
      diff[relativePath] = {
        fixed: expectedFile.issuesDeserialised
      };
      return;
    }

    // If a file exists in the result and not the expected then all the issues are new:
    if (!expectedFile) {
      assert(resultFile);
      diff[relativePath] = {
        neww: resultFile.issuesRaw
      };
      return;
    }

    // Convert all issues to their deserialised form for easier diffing:
    const resultIssues = [...ensureDeserialised(resultFile)];
    const expectedIssues = ensureDeserialised(expectedFile);

    // Find all issues that exist in both result and expected:
    const unchangedExpectedIssues: Array<BettererFileIssueDeserialised> = [];
    const unchangedResultIssues = resultIssues.filter((r) => {
      const expectedIssue = expectedIssues.find((e) => {
        return e.hash === r.hash && e.line === r.line && e.column === r.column && e.length === r.length;
      });
      if (expectedIssue) {
        unchangedExpectedIssues.push(expectedIssue);
      }
      return !!expectedIssue;
    });

    // Any result issues that aren't in expected are either new or have been moved:
    const newOrMovedIssues = resultIssues.filter((r) => !unchangedResultIssues.includes(r));
    // Any expected issues that aren't in result are either fixed or have been moved:
    const fixedOrMovedIssues = expectedIssues.filter((e) => !unchangedExpectedIssues.includes(e));

    // We can find the moved issues by matching the issue hashes:
    const movedIssues: Array<BettererFileIssueDeserialised> = [];
    fixedOrMovedIssues.forEach((fixedOrMovedIssue, index) => {
      const { hash, line, column } = fixedOrMovedIssue;
      // An issue may have been moved it has the same hash in both result and expected
      const possibilities = newOrMovedIssues.filter((newOrMovedIssue) => newOrMovedIssue.hash === hash);
      if (!possibilities.length) {
        return;
      }
      // Start by marking the first possibility as best:
      let best = possibilities.shift();

      // And then search through all the possibilities to find the closest issue:
      possibilities.forEach((possibility) => {
        assert(best);
        if (Math.abs(line - possibility.line) >= Math.abs(line - best.line)) {
          return;
        }
        if (Math.abs(line - possibility.line) < Math.abs(line - best.line)) {
          best = possibility;
        }
        if (Math.abs(column - possibility.column) >= Math.abs(column - best.column)) {
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
    const newIssues = newOrMovedIssues.map((newIssue) => resultFile.issuesRaw[resultIssues.indexOf(newIssue)]);
    const fixedIssues = fixedOrMovedIssues;

    // And finally construct the diff:
    diff[file.relativePath] = {
      existing: [...unchangedExpectedIssues, ...movedIssues],
      fixed: fixedIssues,
      neww: newIssues as BettererFileIssuesRaw
    };
  });

  return diff;
}
