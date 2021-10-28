import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

/**
 * Checks if the given results file path can be accessed.
 */
export async function accessResults(resultsFile: string): Promise<boolean> {
  try {
    await fs.access(resultsFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the given results file path.
 */
export async function readResults(resultsFile: string): Promise<string> {
  try {
    return await fs.readFile(resultsFile, 'utf-8');
  } catch {
    throw new BettererError(`could not read from "${resultsFile}". 😔`);
  }
}

/**
 * Writes a {@link @betterer/results#printResults | printed results object}
 * to the given results file path.
 */
export async function writeResults(printedResults: string, resultsFile: string): Promise<void> {
  try {
    await fs.writeFile(resultsFile, printedResults, 'utf8');
  } catch {
    throw new BettererError(`could not write to "${resultsFile}". 😔`);
  }
}
