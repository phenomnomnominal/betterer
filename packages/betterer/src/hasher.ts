import { createHash } from 'crypto';
import { EOL } from 'os';

const DEFAULT_NEW_LINE = '\n';

export function hash(value: unknown): string {
  const hasher = createHash('sha256');
  hasher.update(JSON.stringify(value).replace(EOL, DEFAULT_NEW_LINE), 'utf8');
  return hasher.digest('hex');
}
