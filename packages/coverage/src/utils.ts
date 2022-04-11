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

function isItem<T>(pattern: unknown): pattern is T {
  return !Array.isArray(pattern);
}

export function isNumber(input: unknown): input is number {
  return typeof input === 'number';
}
