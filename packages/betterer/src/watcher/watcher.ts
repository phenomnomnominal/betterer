// This implementation has borrowed heavily from
// https://github.com/ionic-team/stencil/blob/master/src/sys/node/node-fs-watcher.ts 😘
import { promises as fs } from 'fs';
import * as path from 'path';
import { watch, FSWatcher } from 'chokidar';

import { hash } from '../hasher';
import { WATCH_IGNORES } from './ignores';

const FLUSH_TIMEOUT = 50;

export class FsWatcher {
  private _filesAdded: Array<string> = [];
  private _filesDeleted: Array<string> = [];
  private _filesUpdated = new Map<string, string>();
  private _flushTmrId: NodeJS.Timer | null = null;
  private _dirWatchers = new Map<string, FSWatcher>();
  private _fileWatchers = new Map<string, FSWatcher>();
  private _dirItems = new Map<string, Set<string>>();

  public async addDirectory(dirPath: string, emit = false): Promise<boolean> {
    const shouldQueue = await this._addDirectoryRecursive(dirPath, emit);

    if (emit && shouldQueue) {
      this._queue();
    }

    return shouldQueue;
  }

  public removeDirectory(dirPath: string, emit = false): void {
    this._removeDirectoryRecursive(dirPath);

    if (emit) {
      this._queue();
    }
  }

  public async close(): Promise<void> {
    if (this._flushTmrId) {
      clearTimeout(this._flushTmrId);
    }
    this._reset();

    await Promise.all(
      Array.from(this._dirWatchers.values()).map(watcher => watcher.close())
    );
    this._dirWatchers.clear();

    await Promise.all(
      Array.from(this._fileWatchers.values()).map(watcher => watcher.close())
    );
    this._fileWatchers.clear();
  }

  private async _addDirectoryRecursive(
    dirPath: string,
    emit = false
  ): Promise<boolean> {
    if (this._shouldIgnore(dirPath)) {
      return false;
    }

    let hasChanges = false;
    if (!this._dirWatchers.has(dirPath)) {
      const watcher = watch(dirPath);
      watcher.on('all', (_, fsPath: string) => {
        this._onDirectoryWatch(fsPath);
      });
      this._dirWatchers.set(dirPath, watcher);
      hasChanges = true;
    }

    const subItems = await fs.readdir(dirPath);
    await Promise.all(
      subItems.map(async fileName => {
        const itemPath = path.join(dirPath, fileName);

        const stat = await fs.stat(itemPath);
        if (stat.isFile()) {
          const fileHasChanges = await this.addFile(itemPath, emit, false);
          if (fileHasChanges) {
            hasChanges = true;
          }
        } else if (stat.isDirectory()) {
          this._addDirItem(dirPath, itemPath);
          const dirHasChanges = await this._addDirectoryRecursive(
            itemPath,
            emit
          );
          if (dirHasChanges) {
            hasChanges = true;
          }
        }
      })
    );

    return hasChanges;
  }

  private _removeDirectoryRecursive(dirPath: string): void {
    const dirWatcher = this._dirWatchers.get(dirPath);
    if (dirWatcher != null) {
      this._dirWatchers.delete(dirPath);
      dirWatcher.close();
    }

    const fileWatcher = this._fileWatchers.get(dirPath);
    if (fileWatcher != null) {
      this._fileWatchers.delete(dirPath);
      fileWatcher.close();
    }

    const dirItems = this._dirItems.get(dirPath);
    if (dirItems != null) {
      dirItems.forEach(subDirItem => {
        this._removeDirectoryRecursive(subDirItem);
      });
      this._dirItems.delete(dirPath);
    }
  }

  private _addDirItem(dirPath: string, dirItem: string): void {
    const dirItems = this._dirItems.get(dirPath);
    if (dirItems == null) {
      this._dirItems.set(dirPath, new Set([dirItem]));
    } else {
      dirItems.add(dirItem);
    }
  }

  public async addFile(
    filePath: string,
    emit = false,
    queue = true
  ): Promise<boolean> {
    if (this._shouldIgnore(filePath)) {
      return false;
    }

    let hasChanges = false;
    if (!this._fileWatchers.has(filePath)) {
      const watcher = watch(filePath);
      watcher.on('add', (_: string, fsPath: string) => {
        this.addFile(fsPath, true);
      });
      watcher.on('change', (_: string, fsPath: string) => {
        this._onFileChanged(fsPath);
      });
      watcher.on('unlink', (_: string, fsPath: string) => {
        this._removeFile(fsPath, true);
      });
      this._fileWatchers.set(filePath, watcher);
      this._addDirItem(path.dirname(filePath), filePath);
    }

    if (emit && !this._filesAdded.includes(filePath)) {
      const str = await fs.readFile(filePath, 'utf-8');
      const fileHash = hash(str);

      const existingHash = this._filesUpdated.get(filePath);
      if (existingHash !== fileHash) {
        this._filesUpdated.set(filePath, fileHash);
        this._filesAdded.push(filePath);

        if (queue) {
          this._queue();
        }
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  private _removeFile(filePath: string, emit = false): void {
    const watcher = this._fileWatchers.get(filePath);
    if (watcher != null) {
      this._fileWatchers.delete(filePath);
      watcher.close();
    }

    if (emit && !this._filesDeleted.includes(filePath)) {
      this._filesDeleted.push(filePath);
      this._queue();
    }
  }

  private async _onFileChanged(fsPath: string): Promise<void> {
    if (this._filesUpdated.has(fsPath)) {
      return;
    }

    try {
      const str = await fs.readFile(fsPath, 'utf8');
      const fileHash = hash(str);

      const existingHash = this._filesUpdated.get(fsPath);
      if (existingHash !== fileHash) {
        this._filesUpdated.set(fsPath, fileHash);
        this._queue();
      }
    } catch (e) {
      // Moving on
    }
  }

  private async _onDirectoryWatch(fsPath: string): Promise<void> {
    if (await this._shouldRemove(this._dirWatchers, fsPath)) {
      this.removeDirectory(fsPath, true);
      return;
    }

    if (await this._shouldRemove(this._fileWatchers, fsPath)) {
      this._removeFile(fsPath, true);
      return;
    }

    try {
      const stat = await fs.stat(fsPath);
      if (stat.isDirectory()) {
        this.addDirectory(fsPath, true);
      } else if (stat.isFile()) {
        this.addFile(fsPath, true);
      }
    } catch (e) {
      // Moving on
    }
  }

  private async _shouldRemove(
    watchers: Map<string, FSWatcher>,
    fsPath: string
  ): Promise<boolean> {
    const watcher = watchers.get(fsPath);
    if (watcher != null) {
      try {
        await fs.access(fsPath);
        return false;
      } catch (e) {
        return true;
      }
    }
    return false;
  }

  private _queue(): void {
    // Wait a few moments to see if anything else changed in the file system
    if (this._flushTmrId) {
      clearTimeout(this._flushTmrId);
    }
    this._flushTmrId = setTimeout(() => this._flush(), FLUSH_TIMEOUT);
  }

  private _flush(): void {
    if (
      this._filesAdded.length === 0 &&
      this._filesDeleted.length === 0 &&
      this._filesUpdated.size === 0
    ) {
      return;
    }

    // create the watch results from all that we've learned today
    // const fsWatchResults: d.FsWatchResults = {
    //   filesAdded: this._filesAdded.slice(),
    //   filesDeleted: this._filesDeleted.slice(),
    //   filesUpdated: Array.from(this._filesUpdated.keys())
    // };

    this._reset();

    // this.events.emit('fsChange', fsWatchResults);
  }

  private _reset(): void {
    this._filesAdded.length = 0;
    this._filesDeleted.length = 0;
    this._filesUpdated.clear();
  }

  private _shouldIgnore(filePath: string): boolean {
    if (WATCH_IGNORES.some(i => filePath.endsWith(i))) {
      return true;
    }
    return false;
  }
}
