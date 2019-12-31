import { ConstraintResult } from '@betterer/constraints';
import { code, error } from '@betterer/logger';

import { Betterer } from '../betterer';
import { BettererRunContext } from '../context';
import { MaybeAsync } from '../types';
import { BettererFileInfo, BettererFileMarksMap } from './types';
import { BettererFile } from './file';

export class FileBetterer extends Betterer<BettererFile, BettererFileMarksMap> {
  private _excluded: Array<RegExp> = [];

  constructor(
    test: (files: Array<string>) => MaybeAsync<Array<BettererFileInfo>>
  ) {
    super({
      constraint,
      diff,
      goal,
      test: async (runContext: BettererRunContext): Promise<BettererFile> => {
        const { config, files } = runContext.context;
        const info = await test(files);
        const bettererFile = BettererFile.fromInfo(config, info);
        bettererFile.exclude(this._excluded);
        return bettererFile;
      }
    });
  }

  public exclude(...excludePatterns: Array<RegExp>): FileBetterer {
    this._excluded.push(...excludePatterns);
    return this;
  }
}

function constraint(
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

function diff(
  current: BettererFile,
  serialisedCurrent: BettererFileMarksMap,
  serialisedPrevious: BettererFileMarksMap | null
): void {
  const deserialisedCurrent = BettererFile.fromSerialised(serialisedCurrent);
  const deserialisedPrevious = BettererFile.fromSerialised(serialisedPrevious);

  const files = current.getFilePaths();
  if (serialisedPrevious === null) {
    files.forEach(file => {
      const fileInfo = current.getFileInfo(file);
      const { length } = fileInfo;
      error(`${length} new ${getIssues(length)} in "${file}":`);
      fileInfo.forEach(info => code(info));
    });
    return;
  }

  const filesWithChanges = files.filter(file => {
    const currentMarks = deserialisedCurrent.getFileMarks(file);
    const previousMarks = deserialisedPrevious.getFileMarks(file);
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

  filesWithChanges.forEach(file => {
    const currentMarks = deserialisedCurrent.getFileMarks(file);
    const previousMarks = deserialisedPrevious.getFileMarks(file);
    const fileInfo = current.getFileInfo(file);
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
    error(`${length} new ${getIssues(length)} in "${file}":`);
    changed.forEach(info => code(info));
  });
  return;
}

function goal(value: BettererFileMarksMap): boolean {
  return Object.keys(value).length === 0;
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}
