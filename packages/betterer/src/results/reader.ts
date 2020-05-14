import { promises as fs } from 'fs';

import { requireText } from '../require';
import { COULDNT_READ_RESULTS } from '../errors';
import { BettererExpectedResults } from './types';

export async function read(resultsPath: string): Promise<BettererExpectedResults> {
  let file = '';
  try {
    file = await fs.readFile(resultsPath, 'utf-8');
  } catch {
    return {};
  }

  try {
    return requireText(file);
  } catch {
    throw COULDNT_READ_RESULTS(resultsPath);
  }
}
