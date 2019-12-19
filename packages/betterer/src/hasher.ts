import * as djb2a from 'djb2a';

const NEW_LINES = /\r\n|\r|\n/g;

export function hash(value: unknown): string {
  console.log(JSON.stringify(value).length);
  console.log(
    JSON.stringify(value)
      .replace(NEW_LINES, '\n')
      .split('')
      .map(a => a.charCodeAt(0))
  );
  return djb2a(JSON.stringify(value)).toString();
}
