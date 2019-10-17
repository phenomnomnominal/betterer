import { smaller } from '@betterer/constraints';

import { Betterer, MaybeAsync } from '../types';

export type FileBetterer = Betterer<number>;

export function createFileBetterer(
  test: (...args: Array<unknown>) => MaybeAsync<number>
): FileBetterer {
  return {
    test,
    constraint: smaller,
    goal: 0
  };
}
