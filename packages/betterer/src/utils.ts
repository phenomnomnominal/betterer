import assert from 'assert';
import * as path from 'path';

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isFunction<T>(value: unknown): value is T {
  return typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isRegExp(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function normalisedPath(filePath: string): string {
  return path.sep === path.posix.sep ? filePath : filePath.split(path.sep).join(path.posix.sep);
}

export function getAbsolutePath(resultsPath: string, filePath: string): string {
  return normalisedPath(path.resolve(path.dirname(resultsPath), filePath));
}

export function getRelativePath(resultsPath: string, filePath: string): string {
  return normalisedPath(path.relative(path.dirname(resultsPath), filePath));
}

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;
export type Defer<T> = {
  promise: Promise<T>;
  resolve: Resolve<T>;
  reject: Reject;
};

export function defer<T>(): Defer<T> {
  let resolve: Resolve<T> | null = null;
  let reject: Reject | null = null;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  promise.catch(() => {
    return;
  });
  assert(resolve);
  assert(reject);
  return { promise, resolve, reject };
}

const NEW_LINE = '\n';
const NEW_LINES = /\r\n|\r|\n/g;

export function normaliseNewlines(str: string): string {
  return str.replace(NEW_LINES, NEW_LINE);
}

export function flatten<T>(toFlatten: ReadonlyArray<T | ReadonlyArray<T>>): Array<T> {
  const flattened: Array<T> = [];
  toFlatten.forEach((t) => {
    if (isItem<T>(t)) {
      flattened.push(t);
    } else {
      flattened.push(...t);
    }
  });
  return flattened;
}

export function swapKeyValues(toSwap: Record<string, string>): Record<string, string> {
  return Object.keys(toSwap).reduce((p: Record<string, string>, n: string) => {
    p[toSwap[n]] = n;
    return p;
  }, {} as Record<string, string>);
}

function isItem<T>(pattern: unknown): pattern is T {
  return !Array.isArray(pattern);
}
