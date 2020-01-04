import * as djb2a from 'djb2a';

const NEW_LINE = '\n';
const NEW_LINES = /\r\n|\r|\n/g;

export function hash(value: string): string {
  return djb2a(value.replace(NEW_LINES, NEW_LINE)).toString();
}
