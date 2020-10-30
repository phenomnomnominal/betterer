import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export async function write(toWrite: string, resultsPath: string): Promise<void> {
  try {
    await fs.writeFile(resultsPath, toWrite, 'utf8');
  } catch {
    throw new BettererError(`could not write results to "${resultsPath}". 😔`);
  }
}
