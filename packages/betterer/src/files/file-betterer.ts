import { ConstraintResult } from '@betterer/constraints';
import { Betterer } from '../betterer';
import { BettererRun } from '../context';
import { BettererFile } from './file';
import {
  BettererFileMarksMap,
  FileBettererTest,
  BettererFileInfoDiff
} from './types';

export class FileBetterer extends Betterer<BettererFile, BettererFileMarksMap> {
  private _excluded: Array<RegExp> = [];

  public readonly isFileBetterer = true;

  constructor(test: FileBettererTest) {
    super({
      constraint,
      goal,
      test: async (run: BettererRun): Promise<BettererFile> => {
        const { context, files } = run;
        const info = await test(files);
        const bettererFile = BettererFile.fromInfo(context.config, info);
        bettererFile.exclude(this._excluded);
        return bettererFile;
      }
    });
  }

  public exclude(...excludePatterns: Array<RegExp>): this {
    this._excluded.push(...excludePatterns);
    return this;
  }

  public diff(
    current: BettererFile,
    serialisedCurrent: BettererFileMarksMap,
    serialisedPrevious: BettererFileMarksMap | null
  ): BettererFileInfoDiff {
    const deserialisedCurrent = BettererFile.fromSerialised(serialisedCurrent);
    const deserialisedPrevious = BettererFile.fromSerialised(
      serialisedPrevious
    );

    const files = current.getFilePaths();
    if (serialisedPrevious === null) {
      return files.reduce((d: BettererFileInfoDiff, file: string) => {
        d[file] = current.getFileInfo(file);
        return d;
      }, {});
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

    return filesWithChanges.reduce((d: BettererFileInfoDiff, file: string) => {
      const currentMarks = deserialisedCurrent.getFileMarks(file);
      const previousMarks = deserialisedPrevious.getFileMarks(file);
      const fileInfo = current.getFileInfo(file);
      d[file] = fileInfo.filter((_, index) => {
        const [cLine, cCol, cLen] = currentMarks[index];
        return (
          !previousMarks ||
          !previousMarks.find(([pLine, pCol, pLen]) => {
            return pLine === cLine && pCol === cCol && pLen === cLen;
          })
        );
      });
      return d;
    }, {});
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

function goal(value: BettererFileMarksMap): boolean {
  return Object.keys(value).length === 0;
}

export function isFileBetterer(obj: unknown): obj is FileBetterer {
  return !!(obj as FileBetterer).isFileBetterer;
}
