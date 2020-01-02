import { FileBetterer } from './file-betterer';
import { FileBettererTest } from './types';

export function createFileBetterer(test: FileBettererTest): FileBetterer {
  return new FileBetterer(test);
}
