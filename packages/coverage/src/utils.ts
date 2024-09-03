import path from 'node:path';

export function flatten<T>(toFlatten: ReadonlyArray<T | ReadonlyArray<T>>): Array<T> {
  const flattened: Array<T> = [];
  toFlatten.forEach((t) => {
    if (Array.isArray(t)) {
      flattened.push(...t);
    } else {
      flattened.push(t as T);
    }
  });
  return flattened;
}

export function isNumber(input: unknown): input is number {
  return typeof input === 'number';
}

export function normalisedPath(filePath: string): string {
  return path.sep === path.posix.sep ? filePath : filePath.split(path.sep).join(path.posix.sep);
}
