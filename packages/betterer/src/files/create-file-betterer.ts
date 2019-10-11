import { ConstraintResult } from '@betterer/constraints';
import { code, error } from '@betterer/logger';

import { Betterer, MaybeAsync } from '../types';
import {
  BettererFileInfo,
  BettererFileCodeInfo,
  BettererFileInfoSerialised
} from './file-info';

export type FileBetterer = Betterer<
  BettererFileInfo,
  BettererFileInfoSerialised
>;

export function createFileBetterer(
  test: (...args: Array<unknown>) => MaybeAsync<Array<BettererFileCodeInfo>>
): FileBetterer {
  return {
    test: async (...args: Array<unknown>): Promise<BettererFileInfo> => {
      return new BettererFileInfo(await test(...args));
    },
    constraint,
    goal,
    diff
  };
}

export function constraint(
  current: BettererFileInfoSerialised,
  previous: BettererFileInfoSerialised
): ConstraintResult {
  const previousFiles = Object.keys(previous);
  const currentFiles = Object.keys(current);

  const hasNewFiles = currentFiles.some(file => !previousFiles.includes(file));
  // If there are any new files, then it's worse:
  if (hasNewFiles) {
    return ConstraintResult.worse;
  }

  const filesWithMore = currentFiles.filter(
    filePath => current[filePath].length > previous[filePath].length
  );

  // If any file has new entries, then it's worse:
  if (filesWithMore.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithSame = currentFiles.filter(
    filePath => current[filePath].length === previous[filePath].length
  );

  // If all the files have the same number of entries as before, then it's the same:
  if (filesWithSame.length === previousFiles.length) {
    return ConstraintResult.same;
  }

  // If all the files have the same number of entries as before or fewer, then it's better!
  return ConstraintResult.better;
}

export function goal(value: BettererFileInfoSerialised): boolean {
  return Object.keys(value).length === 0;
}

export function diff(
  current: BettererFileInfo,
  serialisedCurrent: BettererFileInfoSerialised,
  serialisedPrevious: BettererFileInfoSerialised | null
): void {
  const filePaths = current.getFilePaths();
  if (serialisedPrevious === null) {
    filePaths.forEach(filePath => {
      const fileInfo = current.getFileInfo(filePath);
      const { length } = fileInfo;
      console.log('');
      error(`${length} new ${getIssues(length)} in "${filePath}":`);
      fileInfo.forEach(info => code(info));
    });
    return;
  }

  const filesWithChanges = filePaths.filter(filePath => {
    const currentInfo = serialisedCurrent[filePath];
    const previousInfo = serialisedPrevious[filePath];
    if (
      !currentInfo ||
      !previousInfo ||
      currentInfo.length !== previousInfo.length
    ) {
      return true;
    }
    return currentInfo.some(([currentStart, currentLength], index) => {
      const [previousStart, previousLength] = previousInfo[index];
      return currentStart !== previousStart || currentLength !== previousLength;
    });
  });

  filesWithChanges.forEach(filePath => {
    const fileInfo = current.getFileInfo(filePath);
    const changed = fileInfo.filter((_, index) => {
      const [currentStart, currentLength] = serialisedCurrent[filePath][index];
      const previousInfo = serialisedPrevious[filePath];
      return (
        !previousInfo ||
        !!previousInfo.find(([previousStart, previousLength]) => {
          return (
            previousStart === currentStart && previousLength == currentLength
          );
        })
      );
    });
    const { length } = changed;
    console.log('');
    error(`${length} new ${getIssues(length)} in "${filePath}":`);
    changed.forEach(info => code(info));
  });
  return;
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
