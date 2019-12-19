import * as djb2a from 'djb2a';

const NEW_LINES = /\r\n|\r|\n/g;

export function hash(value: unknown): string {
  const result = JSON.stringify(value);
  console.log(result.length);
  console.log(result.replace(NEW_LINES, '\n').length);
  return djb2a(result.replace(NEW_LINES, '\n')).toString();
}
