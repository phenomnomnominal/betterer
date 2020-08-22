import { registerError } from '@betterer/errors';

export const RULES_OPTIONS_REQUIRED = registerError(
  () => "For `@betterer/eslint` to work, you need to provide rule options, e.g. `{ 'no-debugger': 'error' }`. ❌"
);
