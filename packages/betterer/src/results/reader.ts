import { promises as fs } from 'fs';

import { COULDNT_READ_RESULTS } from '../errors';
import { BettererExpectedResults } from './types';

export async function read(resultsPath: string): Promise<BettererExpectedResults> {
  try {
    await fs.readFile(resultsPath);
  } catch {
    return {};
  }

  try {
    return await import(resultsPath);
  } catch {
    throw COULDNT_READ_RESULTS(resultsPath);
  }
}
