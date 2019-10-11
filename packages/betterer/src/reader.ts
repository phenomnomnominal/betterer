import { readFile } from 'fs';
import { promisify } from 'util';

import { BettererResults } from './types';

const readFileAsync = promisify(readFile);

export async function read(resultsPath: string): Promise<BettererResults> {
  try {
    await readFileAsync(resultsPath);
  } catch {
    return {};
  }

  try {
    return await import(resultsPath);
  } catch {
    throw new Error();
  }
}
