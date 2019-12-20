import { ConstraintResult } from '@betterer/constraints';
import { code, error } from '@betterer/logger';

import { BettererConfig } from '../config';
import { Betterer, MaybeAsync } from '../types';
import { BettererFile } from './file';
import { BettererFileMarksMap, BettererFileInfo } from './types';

export type FileBetterer = Betterer<BettererFile, BettererFileMarksMap>;

export function createFileBetterer(
  test: () => MaybeAsync<Array<BettererFileInfo>>
): FileBetterer {
  return {
    test: async (config: BettererConfig): Promise<BettererFile> => {
      return BettererFile.fromInfo(config, await test());
    },
    constraint,
    goal,
    diff
  };
}

export function constraint(
  serialisedCurrent: BettererFileMarksMap,
  serialisedPrevious: BettererFileMarksMap
): ConstraintResult {
  const deserialisedCurrent = BettererFile.fromSerialised(serialisedCurrent);
  const deserialisedPrevious = BettererFile.fromSerialised(serialisedPrevious);
  const currentFiles = deserialisedCurrent.getFilePaths();
  const previousFiles = deserialisedPrevious.getFilePaths();

  const newOrMovedUnchangedFiles = currentFiles.filter(file => {
    return !previousFiles.includes(file);
  });
  const movedUnchangedFiles = newOrMovedUnchangedFiles.filter(file => {
    const fileHash = deserialisedCurrent.getHash(file);
    return deserialisedPrevious.hasHash(fileHash);
  });
  const newFiles = newOrMovedUnchangedFiles.filter(file => {
    return !movedUnchangedFiles.includes(file);
  });
  const existingFiles = currentFiles.filter(file => {
    return !newOrMovedUnchangedFiles.includes(file);
  });

  // If there are any new files, then it's worse:
  if (newFiles.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithMore = existingFiles.filter(filePath => {
    const currentMarks = deserialisedCurrent.getFileMarks(filePath);
    const previousMarks = deserialisedPrevious.getFileMarks(filePath);
    return currentMarks.length > previousMarks.length;
  });

  // If any file has new entries, then it's worse:
  if (filesWithMore.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithSame = existingFiles.filter(filePath => {
    const currentMarks = deserialisedCurrent.getFileMarks(filePath);
    const previousMarks = deserialisedPrevious.getFileMarks(filePath);
    return currentMarks.length === previousMarks.length;
  });

  // If all the files have the same number of entries as before, then it's the same:
  const unchangedFiles = [...filesWithSame, ...movedUnchangedFiles];
  if (unchangedFiles.length === previousFiles.length) {
    return ConstraintResult.same;
  }

  // If all the files have the same number of entries as before or fewer, then it's better!
  return ConstraintResult.better;
}

export function goal(value: BettererFileMarksMap): boolean {
  return Object.keys(value).length === 0;
}

export function diff(
  current: BettererFile,
  serialisedCurrent: BettererFileMarksMap,
  serialisedPrevious: BettererFileMarksMap | null
): void {
  const deserialisedCurrent = BettererFile.fromSerialised(serialisedCurrent);
  const deserialisedPrevious = BettererFile.fromSerialised(serialisedPrevious);
  const filePaths = current.getFilePaths();
  if (serialisedPrevious === null) {
    filePaths.forEach(filePath => {
      const fileInfo = current.getFileInfo(filePath);
      const { length } = fileInfo;
      error(`${length} new ${getIssues(length)} in "${filePath}":`);
      fileInfo.forEach(info => code(info));
    });
    return;
  }

  const filesWithChanges = filePaths.filter(filePath => {
    const currentMarks = deserialisedCurrent.getFileMarks(filePath);
    const previousMarks = deserialisedPrevious.getFileMarks(filePath);
    if (
      !currentMarks ||
      !previousMarks ||
      currentMarks.length !== previousMarks.length
    ) {
      return true;
    }
    return currentMarks.some(([cLine, cColumn, cLength], index) => {
      const [pLine, pColumn, pLength] = previousMarks[index];
      return pLine !== cLine || pColumn !== cColumn || pLength !== cLength;
    });
  });

  filesWithChanges.forEach(filePath => {
    const currentMarks = deserialisedCurrent.getFileMarks(filePath);
    const previousMarks = deserialisedPrevious.getFileMarks(filePath);
    const fileInfo = current.getFileInfo(filePath);
    const changed = fileInfo.filter((_, index) => {
      const [cLine, cColumn, cLength] = currentMarks[index];
      return (
        !previousMarks ||
        !previousMarks.find(([pLine, pColumn, pLength]) => {
          return pLine === cLine && pColumn === cColumn && pLength === cLength;
        })
      );
    });
    const { length } = changed;
    error(`${length} new ${getIssues(length)} in "${filePath}":`);
    changed.forEach(info => code(info));
  });
  return;
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
