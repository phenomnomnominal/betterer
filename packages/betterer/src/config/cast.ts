import { isString } from '../utils.js';

export function toArray<T>(value?: ReadonlyArray<T> | Array<T> | T): Array<T> {
  return Array.isArray(value) ? value : value == null ? [] : [value as T];
}

export function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
