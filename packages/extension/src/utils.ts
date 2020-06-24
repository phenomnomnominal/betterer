export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;
export function nodeRequire(): typeof require {
  const r = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  return r;
}
