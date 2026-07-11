import { BettererError } from '@betterer/errors';
import path from 'node:path';
import { promises as fs } from 'node:fs';

import { normalisedPath } from '../utils.js';
import { read, write } from './file.js';

export async function readdir(dirPath: string): Promise<true | null> {
  try {
    const stat = await fs.stat(dirPath);
    const isDirectory = stat.isDirectory();
    return isDirectory || null;
  } catch {
    return null;
  }
}

export async function walkDir(dirPath: string, subDir = ''): Promise<ReadonlyArray<string>> {
  let entries;
  try {
    entries = await fs.readdir(path.join(dirPath, subDir), { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filePath = normalisedPath(path.join(subDir, entry.name));
      if (entry.isDirectory()) {
        return await walkDir(dirPath, filePath);
      }
      return [filePath];
    })
  );
  return nested.flat();
}

export async function syncDir(dirPath: string, files: Map<string, string>): Promise<boolean> {
  const filePaths = await walkDir(dirPath);
  const onDisk = new Set(filePaths);

  const stale = filePaths.filter((filePath) => !files.has(filePath));
  await Promise.all(stale.map((filePath) => rm(path.join(dirPath, filePath))));

  const writes = await Promise.all(
    Array.from(files, async ([filePath, expectedContent]) => {
      const fullPath = path.join(dirPath, filePath);
      const content = await read(fullPath);
      if (onDisk.has(filePath) && content === expectedContent) {
        return false;
      }
      await write(expectedContent, fullPath);
      return true;
    })
  );
  return stale.length > 0 || writes.includes(true);
}

export async function removeDir(dirPath: string): Promise<void> {
  await rm(dirPath);
}

async function rm(itemPath: string): Promise<void> {
  try {
    await fs.rm(itemPath, { recursive: true, force: true });
  } catch (error) {
    throw new BettererError(`could not delete "${itemPath}". 😔`, error as Error);
  }
}
