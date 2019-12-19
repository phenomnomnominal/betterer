import * as djb2a from 'djb2a';

export function hash(value: unknown): string {
  console.log(JSON.stringify(value).length);
  console.log(
    Array.from(new Set(JSON.stringify(value))).map(a => a.charCodeAt(0))
  );
  return djb2a(JSON.stringify(value)).toString();
}
