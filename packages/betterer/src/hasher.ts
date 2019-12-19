import { createHash } from 'crypto';

export function hash(value: unknown): string {
  const hasher = createHash('sha256');
  hasher.update(JSON.stringify(value), 'utf8');
  return hasher.digest('hex');
}
