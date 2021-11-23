import { BettererError } from '@betterer/errors';
import path from 'path';
import { promises as fs } from 'fs';

import { normalisedPath } from '../utils';

export function forceRelativePaths(toWrite: string, basePath: string): string {
  const directory = `${normalisedPath(path.dirname(basePath))}/`;
  return toWrite.replace(new RegExp(directory, 'g'), '');
}

export async function write(toWrite: string, filePath: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, toWrite, 'utf8');
  } catch {
    throw new BettererError(`could not write to "${filePath}". 😔`);
  }
}
