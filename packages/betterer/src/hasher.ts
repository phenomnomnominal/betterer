import djb2a from 'djb2a';

import { normaliseNewlines } from './utils';

export function createHash(value: string): string {
  return djb2a(normaliseNewlines(value)).toString();
}
