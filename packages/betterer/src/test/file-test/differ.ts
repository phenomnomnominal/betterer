import { BettererLogger } from '@betterer/logger';
import assert from 'assert';

import { BettererFileΩ } from './file';
import { BettererFileTestResultΩ } from './file-test-result';
import {
  BettererFileTestDiff,
  BettererFileIssue,
  BettererFilesDiff,
  BettererFileTestResult,
  BettererFileBase
} from './types';

export function differ(expected: BettererFileTestResult, result: BettererFileTestResult): BettererFileTestDiff {
  const diff: BettererFilesDiff = {};
  const expectedΩ = expected as BettererFileTestResultΩ;
  const resultΩ = result as BettererFileTestResultΩ;

  const unchangedResultFiles = resultΩ.files.filter((r) =>
    expectedΩ.files.find((e) => e.absolutePath === r.absolutePath && e.hash === r.hash)
  );

  const changedResultFiles = resultΩ.files.filter((r) =>
    expectedΩ.files.find((e) => e.absolutePath === r.absolutePath && e.hash !== r.hash)
  );

  const newOrMovedFiles = resultΩ.files.filter((r) => !expectedΩ.files.find((e) => e.absolutePath === r.absolutePath));

  const fixedOrMovedFiles = expectedΩ.files.filter(
    (e) => !resultΩ.files.find((r) => r.absolutePath === e.absolutePath)
  );

  const movedFiles = new Map<BettererFileBase, BettererFileBase>();
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
    diff[file.absolutePath] = {
      fixed: file.issues
    };
  });

  newFiles.forEach((file) => {
    diff[file.absolutePath] = {
      new: file.issues
    };
  });

  const existingFiles = [...unchangedResultFiles, ...changedResultFiles, ...Array.from(movedFiles.keys())];
  existingFiles.forEach((resultFile) => {
    const expectedFile = movedFiles.get(resultFile) || expectedΩ.getFile(resultFile.absolutePath);

    assert(resultFile);
    assert(expectedFile);

    // Convert all issues to their deserialised form for easier diffing:
    const resultIssues = [...resultFile.issues];
    const expectedIssues = expectedFile.issues;

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
    const movedIssues: Array<BettererFileIssue> = [];
    const fixedIssues: Array<BettererFileIssue> = [];
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
    const newIssues = newOrMovedIssues.map((newIssue) => resultFile.issues[resultIssues.indexOf(newIssue)]);

    // If there's no change, move on:
    if (!newIssues.length && !fixedIssues.length) {
      return;
    }

    // Otherwise construct the diff:
    diff[resultFile.absolutePath] = {
      existing: [...unchangedExpectedIssues, ...movedIssues],
      fixed: fixedIssues,
      new: newIssues
    };
  });

  const filePaths = Object.keys(diff);

  return {
    expected,
    result,
    diff,
    log(logger: BettererLogger) {
      filePaths.forEach((filePath) => {
        const existing = diff[filePath].existing || [];
        const fixed = diff[filePath].fixed || [];
        if (fixed?.length) {
          logger.success(`${fixed.length} fixed ${getIssues(fixed.length)} in "${filePath}".`);
        }
        if (existing?.length) {
          logger.warn(`${existing.length} existing ${getIssues(existing.length)} in "${filePath}".`);
        }
        const newIssues = diff[filePath].new || [];
        if (newIssues.length) {
          const { length } = newIssues;
          logger.error(`${length} new ${getIssues(length)} in "${filePath}":`);

          newIssues.forEach((issue) => {
            const fileΩ = resultΩ.getFile(filePath) as BettererFileΩ;
            const { fileText } = fileΩ;
            const { line, column, length, message } = issue;
            logger.code({ message, filePath, fileText, line, column, length });
          });
        }
      });
    }
  };
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
