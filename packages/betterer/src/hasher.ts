import * as djb2a from 'djb2a';

const NEW_LINES = /\r\n|\r|\n/g;
const NORMALISED_NEW_LINE = '\n';

export function hash(value: string): string {
  return djb2a(value.replace(NEW_LINES, NORMALISED_NEW_LINE)).toString();
}
