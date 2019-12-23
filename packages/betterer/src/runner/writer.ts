import { writeFile } from 'fs';
import { promisify } from 'util';

export async function write(printed: string, resultsPath: string): Promise<void> {
  try {
    await promisify(writeFile)(resultsPath, printed, 'utf8');
  } catch {
    throw new Error();
  }
}
