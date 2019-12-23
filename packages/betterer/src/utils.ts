import * as path from 'path';

export function normalisePath(filePath: string): string {
  return path.sep === path.posix.sep
    ? filePath
    : filePath.split(path.sep).join(path.posix.sep);
}

export type MaybeAsync<T> = T | Promise<T>;
