import { registerError } from '@betterer/errors';

export const REGEXP_REQUIRED = registerError(
  () => 'For `@betterer/regexp` to work, you need to provide a RegExp, e.g. `/^foo$/`. ❌'
);
