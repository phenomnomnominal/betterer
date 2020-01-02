import { promises as fs } from 'fs';

import { CANT_WRITE_RESULTS } from '../../errors';

export async function write(
  printed: string,
  resultsPath: string
): Promise<void> {
  try {
    await fs.writeFile(resultsPath, printed, 'utf8');
  } catch {
    throw CANT_WRITE_RESULTS(resultsPath);
  }
}
