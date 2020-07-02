import { promises as fs } from 'fs';

import { COULDNT_WRITE_RESULTS } from '../errors';

const RESULTS_HEADER = `// BETTERER RESULTS V2.`;

export async function write(printed: Array<string>, resultsPath: string): Promise<void> {
  const toWrite = [RESULTS_HEADER, ...printed].join('');
  try {
    await fs.writeFile(resultsPath, toWrite, 'utf8');
  } catch {
    throw COULDNT_WRITE_RESULTS(resultsPath);
  }
}
