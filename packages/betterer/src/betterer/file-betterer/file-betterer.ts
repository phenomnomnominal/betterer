import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../../context';
import { SerialisableBetterer } from '../serialisable-betterer';
import { BettererFiles } from './files';
import { BettererFileTest, BettererFileInfoDiff, BettererFileExcluded, BettererFileMarksMap } from './types';

export class FileBetterer extends SerialisableBetterer<BettererFiles, BettererFileMarksMap> {
  private _excluded: BettererFileExcluded = [];

  public readonly isFileBetterer = true;

  constructor(fileTest: BettererFileTest) {
    super({
      constraint,
      deserialise: BettererFiles.deserialise,
      goal,
      test: async (run: BettererRun): Promise<BettererFiles> => {
        const { files } = run;
        const info = await fileTest(files);

        const included = Object.keys(info).filter(filePath => !this._excluded.some(exclude => exclude.test(filePath)));
        return BettererFiles.fromInfo(info, included);
      }
    });
  }

  public exclude(...excludePatterns: BettererFileExcluded): this {
    this._excluded.push(...excludePatterns);
    return this;
  }

  public getDiff(current: BettererFiles, previous: BettererFiles | null): BettererFileInfoDiff {
    const files = current.files;

    if (previous === null) {
      return files.reduce((d, file) => {
        d[file.filePath] = file.fileInfo;
        return d;
      }, {} as BettererFileInfoDiff);
    }

    const filesWithChanges = files.filter(file => {
      const { filePath } = file;
      const currentMarks = current.getFileMarks(filePath);
      const previousMarks = previous.getFileMarks(filePath);
      if (!currentMarks || !previousMarks || currentMarks.length !== previousMarks.length) {
        return true;
      }
      return currentMarks.some(([cLine, cColumn, cLength], index) => {
        const [pLine, pColumn, pLength] = previousMarks[index];
        return pLine !== cLine || pColumn !== cColumn || pLength !== cLength;
      });
    });

    return filesWithChanges.reduce((d, file) => {
      const currentMarks = current.getFileMarks(file.filePath);
      const previousMarks = previous.getFileMarks(file.filePath);
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

  public getExpected(run: BettererRun): BettererFiles {
    const allExpected = run.test.expected as BettererFiles;
    if (!run.files.length) {
      return allExpected;
    }
    return allExpected.filter(run.files);
  }
}

function constraint(current: BettererFiles, previous: BettererFiles): ConstraintResult {
  const currentFiles = current.getFilePaths();
  const previousFiles = previous.getFilePaths();

  const newOrMovedUnchangedFiles = currentFiles.filter(file => {
    return !previousFiles.includes(file);
  });
  const movedUnchangedFiles = newOrMovedUnchangedFiles.filter(file => {
    const fileHash = current.getFileHash(file);
    return previous.hasHash(fileHash);
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
    const currentMarks = current.getFileMarks(filePath);
    const previousMarks = previous.getFileMarks(filePath);
    return currentMarks.length > previousMarks.length;
  });

  // If any file has new entries, then it's worse:
  if (filesWithMore.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithSame = existingFiles.filter(filePath => {
    const currentMarks = current.getFileMarks(filePath);
    const previousMarks = previous.getFileMarks(filePath);
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

function goal(value: BettererFiles): boolean {
  return value.files.every(file => file.fileMarks.length === 0);
}

export function isFileBetterer(obj: unknown): obj is FileBetterer {
  return (obj as FileBetterer).isFileBetterer;
}
