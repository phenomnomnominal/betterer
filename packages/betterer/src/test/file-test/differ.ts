import { codeΔ, errorΔ, successΔ, warnΔ } from '@betterer/logger';
import * as assert from 'assert';

import { ensureDeserialised } from './serialiser';
import {
  BettererFile,
  BettererFiles,
  BettererFileTestDiff,
  BettererFileIssueDeserialised,
  BettererFilesDiff
} from './types';

export function differ(expected: BettererFiles, result: BettererFiles): BettererFileTestDiff {
  const diff = {} as BettererFilesDiff;

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
    const expectedFile = expected.getFileΔ(resultFile.absolutePath) || movedFiles.get(resultFile);

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

  return {
    expected,
    result,
    diff,
    log() {
      assert(diff);
      Object.keys(diff).forEach((file) => {
        const issues = diff[file];
        const { existing, fixed } = issues;
        if (fixed?.length) {
          successΔ(`${fixed.length} fixed ${getIssues(fixed.length)} in "${file}".`);
        }
        if (existing?.length) {
          warnΔ(`${existing.length} existing ${getIssues(existing.length)} in "${file}".`);
        }
        if (issues.neww?.length) {
          const { length } = issues.neww;
          errorΔ(`${length} new ${getIssues(length)} in "${file}":`);
          issues.neww.forEach((info) => codeΔ(info));
        }
      });
    }
  };
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
