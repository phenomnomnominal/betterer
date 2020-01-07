import { registerError } from '@betterer/errors';

export const FILE_GLOB_REQUIRED = registerError(
  () => "For `@betterer/eslint` to work, you need to provide a file glob, e.g. `'./src/**/*'`. ❌"
);
export const RULE_OPTIONS_REQUIRED = registerError(
  () => "For `@betterer/eslint` to work, you need to provide rule options, e.g. `['no-debugger', 'error']`. ❌"
);
