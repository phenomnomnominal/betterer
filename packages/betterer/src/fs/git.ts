import type { SimpleGit } from 'simple-git';

import type { BettererFilePath, BettererFilePaths, BettererVersionControl } from './types.js';

import path from 'node:path';
import { simpleGit } from 'simple-git';

import { normalisedPath } from '../utils.js';

export class BettererGitΩ implements BettererVersionControl {
  private _filePaths: Array<string> = [];
  private _syncing: Promise<void> | null = null;

  private constructor(
    private _git: SimpleGit,
    private _rootDir: BettererFilePath
  ) {}

  public static async create(versionControlPath: BettererFilePath): Promise<BettererGitΩ> {
    const git = simpleGit(versionControlPath);
    const versionControl = new BettererGitΩ(git, versionControlPath);
    await versionControl.sync();
    return versionControl;
  }

  public async add(resultsPath: string): Promise<void> {
    await this._git.add(resultsPath);
  }

  public getFilePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public async sync(): Promise<void> {
    if (this._syncing) {
      await this._syncing;
      return;
    }
    this._syncing = this._sync();
    await this._syncing;
    this._syncing = null;
  }

  private _toFilePaths(rootDir: string, lines: Array<string>): Array<string> {
    return lines.map((line) => toAbsolutePath(rootDir, line));
  }

  private _toLines(output: string): Array<string> {
    if (output.length === 0) {
      return [];
    }
    return Array.from(new Set(output.trimEnd().split('\n')));
  }

  private async _sync(): Promise<void> {
    this._filePaths = [];

    // Collect all tracked files, excluding files that have been deleted, *and* all untracked files:
    const allFilesOutput = await this._git.raw(['ls-files', '--cached', '--others', '--exclude-standard']);
    const allFilePaths = this._toFilePaths(this._rootDir, this._toLines(allFilesOutput));
    allFilePaths.map((absolutePath) => {
      this._filePaths.push(absolutePath);
    });
  }
}

function toAbsolutePath(rootDir: string, relativePath: string): string {
  return normalisedPath(path.join(rootDir, relativePath.trimStart()));
}
