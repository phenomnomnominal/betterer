import { ConstraintResult } from '@betterer/constraints';
import * as path from 'path';

import { BettererRun } from '../../context';
import { SerialisableBetterer } from '../serialisable-betterer';
import { BettererFiles } from './files';
import {
  BettererFileTest,
  BettererFileInfoDiff,
  BettererFileExcluded,
  BettererFileIssuesMap,
  BettererFileInfoMap,
  BettererFileIssue,
} from './types';
import { BettererLoggerCodeInfo } from '@betterer/logger/src';

export class FileBetterer extends SerialisableBetterer<BettererFiles, BettererFileIssuesMap> {
  private _excluded: BettererFileExcluded = [];

  public readonly isFileBetterer = true;

  constructor(fileTest: BettererFileTest) {
    super({
      constraint,
      deserialise: BettererFiles.deserialise,
      goal,
      test: async (run: BettererRun): Promise<BettererFiles> => {
        const { files, test } = run;

        const info = await fileTest(files);

        const { resultsPath } = test.context.config;
        const relativeInfo = Object.keys(info).reduce((i, filePath) => {
          i[this._getPath(resultsPath, filePath)] = info[filePath];
          return i;
        }, {} as BettererFileInfoMap);
        const included = Object.keys(relativeInfo).filter(
          (filePath) => !this._excluded.some((exclude) => exclude.test(filePath))
        );

        return BettererFiles.fromInfo(relativeInfo, included);
      },
    });
  }

  public exclude(...excludePatterns: BettererFileExcluded): this {
    this._excluded = [...this._excluded, ...excludePatterns];
    return this;
  }

  public getDiff(current: BettererFiles, previous: BettererFiles | null): BettererFileInfoDiff {
    const files = current.files;

    if (previous === null) {
      return files.reduce((d, file) => {
        d[file.filePath] = { new: file.fileInfo };
        return d;
      }, {} as BettererFileInfoDiff);
    }

    const filesWithChanges = files.filter((file) => {
      const { filePath } = file;
      const currentIssues = current.getFileIssues(filePath);
      const previousIssues = previous.getFileIssues(filePath);
      if (!currentIssues || !previousIssues || currentIssues.length !== previousIssues.length) {
        return true;
      }
      return currentIssues.some((c, index) => {
        const p = previousIssues[index];
        return p.line !== c.line || p.col !== c.col || p.length !== c.length;
      });
    });

    return filesWithChanges.reduce((d, file) => {
      const currentIssues = current.getFileIssues(file.filePath);
      const previousIssues = previous.getFileIssues(file.filePath);
      const existingIssues = file.fileInfo.filter((_, index) => {
        const c = currentIssues[index];
        return !!previousIssues?.find((p) => {
          return p.hash === c.hash && p.line === c.line && p.col === c.col && p.length === c.length;
        });
      });
      const movedIssues: Array<BettererLoggerCodeInfo> = [];
      previousIssues.forEach((p) => {
        const possibilities = currentIssues.filter((c) => {
          return p.hash === c.hash;
        });
        const bestPossibility = possibilities.reduce((b, n) => {
          if (!b) {
            return n;
          }
          if (Math.abs(p.line - n.line) > Math.abs(p.line - b.line)) {
            return b;
          }
          if (Math.abs(p.line - n.line) < Math.abs(p.line - b.line)) {
            return n;
          }
          if (Math.abs(p.col - n.col) > Math.abs(p.col - b.col)) {
            return b;
          }
          if (Math.abs(p.col - n.col) < Math.abs(p.col - b.col)) {
            return n;
          }
          return b;
        }, null as BettererFileIssue | null);
        if (bestPossibility) {
          movedIssues.push(file.fileInfo[currentIssues.indexOf(bestPossibility)]);
        }
      });
      const newIssues = file.fileInfo.filter(issue => {
        return !existingIssues.includes(issue) && !movedIssues.includes(issue);
      })
      d[file.filePath] = {
        existing: [...existingIssues, ...movedIssues],
        new: newIssues
      }
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

  private _getPath(resultsPath: string, filePath: string): string {
    const relativeFilePath = path.relative(resultsPath, filePath);
    return path.sep === path.posix.sep ? relativeFilePath : relativeFilePath.split(path.sep).join(path.posix.sep);
  }
}

function constraint(current: BettererFiles, previous: BettererFiles): ConstraintResult {
  const currentFiles = current.getFilePaths();
  const previousFiles = previous.getFilePaths();

  const newOrMovedUnchangedFiles = currentFiles.filter((file) => {
    return !previousFiles.includes(file);
  });
  const movedUnchangedFiles = newOrMovedUnchangedFiles.filter((file) => {
    const fileHash = current.getFileHash(file);
    return previous.hasHash(fileHash);
  });
  const newFiles = newOrMovedUnchangedFiles.filter((file) => {
    return !movedUnchangedFiles.includes(file);
  });
  const existingFiles = currentFiles.filter((file) => {
    return !newOrMovedUnchangedFiles.includes(file);
  });

  // If there are any new files, then it's worse:
  if (newFiles.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithMore = existingFiles.filter((filePath) => {
    const currentIssues = current.getFileIssues(filePath);
    const previousIssues = previous.getFileIssues(filePath);
    return currentIssues.length > previousIssues.length;
  });

  // If any file has more entries, then it's worse:
  if (filesWithMore.length > 0) {
    return ConstraintResult.worse;
  }

  const filesWithSame = existingFiles.filter((filePath) => {
    const currentIssues = current.getFileIssues(filePath);
    const previousIssues = previous.getFileIssues(filePath);
    return currentIssues.length === previousIssues.length;
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
  return value.files.every((file) => file.fileIssues.length === 0);
}

export function isFileBetterer(obj: unknown): obj is FileBetterer {
  return (obj as FileBetterer).isFileBetterer;
}
