import { promises as fs } from 'fs';

import { normaliseNewlines } from '../utils';

export async function read(resultsPath: string): Promise<string | null> {
  try {
    const file = await fs.readFile(resultsPath, 'utf-8');
    return normaliseNewlines(file);
  } catch {
    return null;
  }
}
