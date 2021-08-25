import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export async function access(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function read(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    throw new BettererError(`could not read from "${filePath}". 😔`);
  }
}

export async function write(toWrite: string, filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, toWrite, 'utf8');
  } catch {
    throw new BettererError(`could not write to "${filePath}". 😔`);
  }
}
