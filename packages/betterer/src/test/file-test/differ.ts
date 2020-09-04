import { codeΔ, errorΔ, successΔ, warnΔ } from '@betterer/logger';
import * as assert from 'assert';

import { BettererFileΩ } from './file';
import { BettererFilesΩ } from './files';
import {
  BettererFileTestDiff,
  BettererFileIssueDeserialised,
  BettererFileIssuesMapDeserialised,
  BettererFileIssuesMapRaw,
  BettererFilesDiff
} from './types';

export function differ(expected: BettererFilesΩ, result: BettererFilesΩ): BettererFileTestDiff {
  const fixedIssuesByFile: BettererFileIssuesMapDeserialised = {};
  const existingIssuesByFile: BettererFileIssuesMapDeserialised = {};
  const newIssuesByFile: BettererFileIssuesMapDeserialised = {};
  const newIssuesRawByFile: BettererFileIssuesMapRaw = {};

  const unchangedResultFiles = result.filesΔ.filter((r) =>
    expected.filesΔ.find((e) => e.absolutePath === r.absolutePath && e.hash === r.hash)
  );

  const changedResultFiles = result.filesΔ.filter((r) =>
    expected.filesΔ.find((e) => e.absolutePath === r.absolutePath && e.hash !== r.hash)
  );

  const newOrMovedFiles = result.filesΔ.filter((r) => !expected.filesΔ.find((e) => e.absolutePath === r.absolutePath));

  const fixedOrMovedFiles = expected.filesΔ.filter(
    (e) => !result.filesΔ.find((r) => r.absolutePath === e.absolutePath)
  );

  const movedFiles = new Map<BettererFileΩ, BettererFileΩ>();
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
    fixedIssuesByFile[file.relativePath] = file.issues;
  });

  newFiles.forEach((file) => {
    newIssuesByFile[file.relativePath] = file.issues;
    newIssuesRawByFile[file.relativePath] = file.issuesRaw;
  });

  const existingFiles = [...unchangedResultFiles, ...changedResultFiles, ...Array.from(movedFiles.keys())];
  existingFiles.forEach((resultFile) => {
    const expectedFile = expected.getFileΔ(resultFile.absolutePath) || movedFiles.get(resultFile);

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
    const newIssuesRaw = newOrMovedIssues.map((newIssue) => resultFile.issuesRaw[resultIssues.indexOf(newIssue)]);
    const newIssues = newOrMovedIssues.map((newIssue) => resultFile.issues[resultIssues.indexOf(newIssue)]);

    // If there's no change, move on:
    if (!newIssues.length && !fixedIssues.length) {
      return;
    }

    // Otherwise construct the diff:
    existingIssuesByFile[resultFile.relativePath] = [...unchangedExpectedIssues, ...movedIssues];
    fixedIssuesByFile[resultFile.relativePath] = fixedIssues;
    newIssuesByFile[resultFile.relativePath] = newIssues;
    newIssuesRawByFile[resultFile.relativePath] = newIssuesRaw;
  });

  const diff: BettererFilesDiff = {};
  const filePaths = Array.from(
    new Set([...Object.keys(existingIssuesByFile), ...Object.keys(fixedIssuesByFile), ...Object.keys(newIssuesByFile)])
  );
  filePaths.forEach((filePath) => {
    diff[filePath] = {
      existing: existingIssuesByFile[filePath],
      fixed: fixedIssuesByFile[filePath],
      new: newIssuesByFile[filePath]
    };
  });

  return {
    expected,
    result,
    diff,
    log() {
      filePaths.forEach((filePath) => {
        const existing = existingIssuesByFile[filePath] || [];
        const fixed = fixedIssuesByFile[filePath] || [];
        if (fixed?.length) {
          successΔ(`${fixed.length} fixed ${getIssues(fixed.length)} in "${filePath}".`);
        }
        if (existing?.length) {
          warnΔ(`${existing.length} existing ${getIssues(existing.length)} in "${filePath}".`);
        }
        const newRaw = newIssuesRawByFile[filePath] || [];
        if (newRaw.length) {
          const { length } = newRaw;
          errorΔ(`${length} new ${getIssues(length)} in "${filePath}":`);
          newRaw.forEach((info) => codeΔ(info));
        }
      });
    }
  };
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
