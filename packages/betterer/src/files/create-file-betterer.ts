import { FileBetterer } from './file-betterer';
import { BettererFileTest } from './types';

export function createFileBetterer(test: BettererFileTest): FileBetterer {
  return new FileBetterer(test);
}
