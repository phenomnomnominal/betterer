import { MaybeAsync } from '../types';
import { FileBetterer } from './file-betterer';
import { BettererFileInfo } from './types';

export function createFileBetterer(
  test: (files: ReadonlyArray<string>) => MaybeAsync<Array<BettererFileInfo>>
): FileBetterer {
  return new FileBetterer(test);
}
