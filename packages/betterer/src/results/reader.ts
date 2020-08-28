import { promises as fs } from 'fs';

export async function read(resultsPath: string): Promise<string | null> {
  try {
    return await fs.readFile(resultsPath, 'utf-8');
  } catch {
    return null;
  }
}
