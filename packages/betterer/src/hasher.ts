import * as djb2a from 'djb2a';

export function hash(value: unknown): string {
  console.log(JSON.stringify(value).length);
  console.log(new Set(JSON.stringify(value)));
  return djb2a(JSON.stringify(value)).toString();
}
