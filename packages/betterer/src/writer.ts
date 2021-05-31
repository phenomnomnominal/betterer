import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export async function write(toWrite: string, filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, toWrite, 'utf8');
  } catch {
    throw new BettererError(`could not write to "${filePath}". 😔`);
  }
}
