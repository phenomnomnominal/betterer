import { BettererFilesΩ } from './files';
import { BettererFiles } from './types';

export function goal(result: BettererFiles): boolean {
  const resultΩ = result as BettererFilesΩ;
  return resultΩ.files.filter((file) => file.issues.length).length === 0;
}
