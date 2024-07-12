import type { FixtureFileSystem, FixtureFileSystemFiles, Paths } from './types.js';

import { promises as fs } from 'node:fs';
import path from 'node:path';

const DEFAULT_CACHE_PATH = './.betterer.cache';
const DEFAULT_CONFIG_PATH = './.betterer.ts';
const DEFAULT_RESULTS_PATH = `./.betterer.results`;

export async function createFixtureFS(
  fixturePath: string,
  files: FixtureFileSystemFiles = {}
): Promise<FixtureFileSystem> {
  function resolve(itemPath: string): string {
    return normalisedPath(path.resolve(fixturePath, itemPath));
  }

  function normalisedPath(filePath: string): string {
    return path.sep === path.posix.sep ? filePath : filePath.split(path.sep).join(path.posix.sep);
  }

  async function cleanup(): Promise<void> {
    return await rimraf(fixturePath);
  }

  async function writeFile(filePath: string, text: string): Promise<void> {
    const fullPath = resolve(filePath);
    await ensureDir(path.dirname(fullPath));
    return await fs.writeFile(fullPath, text.trim(), 'utf8');
  }

  async function deleteDirectory(directoryPath: string): Promise<void> {
    return await rimraf(directoryPath);
  }

  async function deleteFile(filePath: string): Promise<void> {
    return await fs.unlink(resolve(filePath));
  }

  function readFile(filePath: string): Promise<string> {
    return fs.readFile(resolve(filePath), 'utf8');
  }

  function rimraf(directoryPath: string): Promise<void> {
    return fs.rm(directoryPath, { recursive: true });
  }

  const paths: Paths = {
    cache: resolve(DEFAULT_CACHE_PATH),
    config: resolve(DEFAULT_CONFIG_PATH),
    cwd: fixturePath,
    results: resolve(DEFAULT_RESULTS_PATH)
  };

  try {
    await cleanup();
  } catch {
    // Move on...
  }

  try {
    await ensureDir(fixturePath);
  } catch {
    // Move on...
  }
  await Promise.all(
    Object.keys(files).map(async (itemPath) => {
      await writeFile(itemPath, files[itemPath]);
    })
  );

  return { paths, deleteDirectory, deleteFile, resolve, cleanup, readFile, writeFile };
}

async function ensureDir(directoryPath: string): Promise<void> {
  await fs.mkdir(directoryPath, { recursive: true });
}
