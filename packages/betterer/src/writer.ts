import { promises as fs } from 'fs';

import { COULDNT_WRITE_RESULTS } from './errors';

export async function write(toWrite: string, resultsPath: string): Promise<void> {
  try {
    await fs.writeFile(resultsPath, toWrite, 'utf8');
  } catch {
    throw COULDNT_WRITE_RESULTS(resultsPath);
  }
}
