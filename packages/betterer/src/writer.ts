import path from 'path';

import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export function forceRelativePaths(toWrite: string, filePath: string): string {
  const directory = `${path.dirname(filePath)}/`;
  return toWrite.replace(new RegExp(directory, 'g'), '');
}

export async function write(toWrite: string, filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, toWrite, 'utf8');
  } catch {
    throw new BettererError(`could not write to "${filePath}". 😔`);
  }
}
