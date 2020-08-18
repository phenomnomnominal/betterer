import { ConstraintResult } from '@betterer/constraints';
import * as assert from 'assert';

import { BettererFile } from './file';
import { BettererFiles } from './files';
import { ensureDeserialised } from './serialiser';
import { BettererFileTestDiff, BettererFileIssueDeserialised } from './types';

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
  const diff = {} as BettererFileTestDiff;

  const unchangedResultFiles = result.files.filter((r) =>
    expected.files.find((e) => e.absolutePath === r.absolutePath && e.hash === r.hash)
  );

  const changedResultFiles = result.files.filter((r) =>
    expected.files.find((e) => e.absolutePath === r.absolutePath && e.hash !== r.hash)
  );

  const newOrMovedFiles = result.files.filter((r) => !expected.files.find((e) => e.absolutePath === r.absolutePath));

  const fixedOrMovedFiles = expected.files.filter((e) => !result.files.find((r) => r.absolutePath === e.absolutePath));

  const movedFiles = new Map<BettererFile, BettererFile>();
  fixedOrMovedFiles.forEach((fixedOrMovedFile, index) => {
    // A file may have been moved it has the same hash in both result and expected
    const possibilities = newOrMovedFiles.filter((newOrMovedFile) => newOrMovedFile.hash === fixedOrMovedFile.hash);
    if (!possibilities.length) {
      return;
    }

    // Multiple possibilities means that the same content has been moved into multiple new files.
    // So just count the first one as a move, the rest will be new files:
    const [moved] = possibilities;
    movedFiles.set(moved, fixedOrMovedFile);

    // Remove the moved file from the fixedOrMovedFiles array:
    fixedOrMovedFiles.splice(index, 1);
    // And from the newOrMovedFiles array:
    newOrMovedFiles.splice(newOrMovedFiles.indexOf(moved), 1);
  });

  // All the moved files have been removed from fixedOrMovedFiles and newOrMovedFiles:
  const fixedFiles = fixedOrMovedFiles;
  const newFiles = newOrMovedFiles;

  fixedFiles.forEach((file) => {
    diff[file.relativePath] = {
      fixed: file.issuesDeserialised
    };
  });

  newFiles.forEach((file) => {
    diff[file.relativePath] = {
      neww: file.issuesRaw
    };
  });

  const existingFiles = [...unchangedResultFiles, ...changedResultFiles, ...Array.from(movedFiles.keys())];
  existingFiles.forEach((resultFile) => {
    const expectedFile = expected.getFile(resultFile.absolutePath) || movedFiles.get(resultFile);

    assert(resultFile);
    assert(expectedFile);

    // Convert all issues to their deserialised form for easier diffing:
    const resultIssues = [...ensureDeserialised(resultFile)];
    const expectedIssues = ensureDeserialised(expectedFile);

    // Find all issues that exist in both result and expected:
    const unchangedExpectedIssues = expectedIssues.filter((r) =>
      resultIssues.find((e) => {
        return e.line === r.line && e.column === r.column && e.length === r.length && e.hash === r.hash;
      })
    );
    const unchangedResultIssues = resultIssues.filter((r) =>
      expectedIssues.find((e) => {
        return e.line === r.line && e.column === r.column && e.length === r.length && e.hash === r.hash;
      })
    );

    // Any result issues that aren't in expected are either new or have been moved:
    const newOrMovedIssues = resultIssues.filter((r) => !unchangedResultIssues.includes(r));
    // Any expected issues that aren't in result are either fixed or have been moved:
    const fixedOrMovedIssues = expectedIssues.filter((e) => !unchangedExpectedIssues.includes(e));

    // We can find the moved issues by matching the issue hashes:
    const movedIssues: Array<BettererFileIssueDeserialised> = [];
    const fixedIssues: Array<BettererFileIssueDeserialised> = [];
    fixedOrMovedIssues.forEach((fixedOrMovedIssue) => {
      const { hash, line, column } = fixedOrMovedIssue;
      // An issue may have been moved it has the same hash in both result and expected
      const possibilities = newOrMovedIssues.filter((newOrMovedIssue) => newOrMovedIssue.hash === hash);
      if (!possibilities.length) {
        // If there is no matching has the issue must have been fixed:
        fixedIssues.push(fixedOrMovedIssue);
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

      // Remove the moved issue from the newOrMovedIssues array:
      newOrMovedIssues.splice(newOrMovedIssues.indexOf(best), 1);

      movedIssues.push(best);
    });

    // Find the raw issue data so that diffs can be logged:
    const newIssues = newOrMovedIssues.map((newIssue) => resultFile.issuesRaw[resultIssues.indexOf(newIssue)]);

    // If there's no change, move on:
    if (!newIssues.length && !fixedIssues.length) {
      return;
    }

    // Otherwise construct the diff:
    diff[resultFile.relativePath] = {
      existing: [...unchangedExpectedIssues, ...movedIssues],
      fixed: fixedIssues,
      neww: newIssues
    };
  });

  return diff;
}
