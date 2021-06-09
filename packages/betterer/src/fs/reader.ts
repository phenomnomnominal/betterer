import { promises as fs } from 'fs';

import { normaliseNewlines } from '../utils';

const READ_CACHE: Record<string, string> = {};
const READ_CACHE_TIME: Record<string, number> = {};

export async function read(filePath: string): Promise<string | null> {
  try {
    const stat = await fs.stat(filePath);
    const modifiedTime = stat.mtime.getTime();
    if (READ_CACHE_TIME[filePath] === modifiedTime) {
      return READ_CACHE[filePath];
    }

    const contents = await fs.readFile(filePath, 'utf-8');
    const normalisedContents = normaliseNewlines(contents);
    READ_CACHE[filePath] = normalisedContents;
    READ_CACHE_TIME[filePath] = modifiedTime;
    return normalisedContents;
  } catch {
    return null;
  }
}
