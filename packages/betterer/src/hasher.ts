import djb2a from 'djb2a';
import memoize from 'fast-memoize';

import { isString, normaliseNewlines } from './utils.js';
import { invariantΔ } from '@betterer/errors';

export const createHash = memoize(
  function createHash(value: string): string {
    return djb2a(normaliseNewlines(value)).toString();
  },
  {
    serializer: (value: unknown) => {
      invariantΔ(isString(value), '`createHash` should only be called with string arguments!');
      return value;
    }
  }
);
