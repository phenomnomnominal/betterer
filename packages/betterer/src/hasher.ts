import * as djb2a from 'djb2a';

export function hash(value: unknown): string {
  console.log(new Set(JSON.stringify(value)).size);
  return djb2a(JSON.stringify(value)).toString();
}
