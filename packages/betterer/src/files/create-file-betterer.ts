import { MaybeAsync } from '../types';
import { FileBetterer } from './file-betterer';
import { BettererFileInfo } from './types';

export function createFileBetterer(test: () => MaybeAsync<Array<BettererFileInfo>>): FileBetterer {
  return new FileBetterer(test);
}
