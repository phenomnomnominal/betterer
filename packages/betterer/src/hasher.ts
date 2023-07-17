import djb2a from 'djb2a';
import memoize from 'fast-memoize';

import { normaliseNewlines } from './utils.js';

export const createHash = memoize(function createHash(value: string): string {
  return djb2a(normaliseNewlines(value)).toString();
});
