import { registerError } from '@betterer/errors';

export const CONFIG_PATH_REQUIRED = registerError(
  () =>
    "For `@betterer/typescript` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
);
export const COMPILER_OPTIONS_REQUIRED = registerError(
  () => 'For `@betterer/typescript` to work, you need to provide compiler options, e.g. `{ strict: true }`. ❌'
);
