export function serialise(value: unknown): string {
  return isJSON(value) ? value : JSON.stringify(value);
}

function isJSON(value: unknown): value is string {
  try {
    JSON.parse(value as string);
    return typeof value === 'string';
  } catch {
    return false;
  }
}
