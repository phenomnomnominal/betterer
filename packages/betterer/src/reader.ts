import { readFile } from 'fs';
import { promisify } from 'util';

import { BetterResults } from './types';

const readFileAsync = promisify(readFile);

export async function read(resultsPath: string): Promise<BetterResults> {
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
