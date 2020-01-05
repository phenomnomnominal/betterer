import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../../context';
import { Betterer } from '../betterer';
import { BettererFiles } from './files';
import { BettererFileTest, BettererFileInfoDiff, BettererFileExcluded, BettererFileMarksMap } from './types';

export class FileBetterer extends Betterer<BettererFiles, BettererFileMarksMap> {
  private _excluded: BettererFileExcluded = [];

  public readonly isFileBetterer = true;

  constructor(fileTest: BettererFileTest) {
    super({
      constraint,
      goal,
      test: async (run: BettererRun): Promise<BettererFiles> => {
        const { files } = run;
        const info = await fileTest(files);

        const included = files.filter(filePath => !this._excluded.some(exclude => exclude.test(filePath)));
        return BettererFiles.fromInfo(info, included);
      }
    });
  }

  public exclude(...excludePatterns: BettererFileExcluded): this {
    this._excluded.push(...excludePatterns);
    return this;
  }

  public getDiff(
    current: BettererFiles,
    serialisedCurrent: BettererFileMarksMap,
    serialisedPrevious: BettererFileMarksMap | null
  ): BettererFileInfoDiff {
    const files = current.files;

    if (serialisedPrevious === null) {
      return files.reduce((d, file) => {
        d[file.filePath] = file.fileInfo;
        return d;
      }, {} as BettererFileInfoDiff);
    }

    const deserialisedCurrent = BettererFiles.fromSerialised(serialisedCurrent);
    const deserialisedPrevious = BettererFiles.fromSerialised(serialisedPrevious);

    const filesWithChanges = files.filter((_, index) => {
      const currentMarks = deserialisedCurrent.files[index].fileMarks;
      const previousMarks = deserialisedPrevious.files[index].fileMarks;
      if (!currentMarks || !previousMarks || currentMarks.length !== previousMarks.length) {
        return true;
      }
      return currentMarks.some(([cLine, cColumn, cLength], index) => {
        const [pLine, pColumn, pLength] = previousMarks[index];
        return pLine !== cLine || pColumn !== cColumn || pLength !== cLength;
      });
    });

    return filesWithChanges.reduce((d, file) => {
      const currentMarks = deserialisedCurrent.getFileMarks(file.filePath);
      const previousMarks = deserialisedPrevious.getFileMarks(file.filePath);
      d[file.filePath] = file.fileInfo.filter((_, index) => {
        const [cLine, cCol, cLen] = currentMarks[index];
        return (
          !previousMarks ||
          !previousMarks.find(([pLine, pCol, pLen]) => {
            return pLine === cLine && pCol === cCol && pLen === cLen;
          })
        );
      });
      return d;
    }, {} as BettererFileInfoDiff);
  }

  public getExpected(run: BettererRun): BettererFileMarksMap {
    const expected = run.test.context.expected[run.name];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const { files } = BettererFiles.fromSerialised(expected as BettererFileMarksMap);
    return new BettererFiles(files.filter(file => run.files.includes(file.filePath))).serialise();
  }
}

function constraint(
  serialisedCurrent: BettererFileMarksMap,
  serialisedPrevious: BettererFileMarksMap
): ConstraintResult {
  const deserialisedCurrent = BettererFiles.fromSerialised(serialisedCurrent);
  const deserialisedPrevious = BettererFiles.fromSerialised(serialisedPrevious);
  const currentFiles = deserialisedCurrent.getFilePaths();
  const previousFiles = deserialisedPrevious.getFilePaths();

  const newOrMovedUnchangedFiles = currentFiles.filter(file => {
    return !previousFiles.includes(file);
  });
  const movedUnchangedFiles = newOrMovedUnchangedFiles.filter(file => {
    const fileHash = deserialisedCurrent.getFileHash(file);
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
  return (obj as FileBetterer).isFileBetterer;
}
