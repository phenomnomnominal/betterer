import { promises as fs } from 'fs';

import { BettererResults } from './results';

export async function read(resultsPath: string): Promise<BettererResults> {
  try {
    await fs.readFile(resultsPath);
  } catch {
    return {};
  }

  try {
    return await import(resultsPath);
  } catch {
    throw new Error();
  }
}
