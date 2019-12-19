import * as djb2a from 'djb2a';

export function hash(value: unknown): string {
  return djb2a(JSON.stringify(value)).toString();
}
