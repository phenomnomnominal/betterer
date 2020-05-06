import { registerError } from '@betterer/errors';

export const CONFIG_PATH_REQUIRED = registerError(
  () =>
    "For `@betterer/tsquery` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
);
export const QUERY_REQUIRED = registerError(
  () =>
    "For `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
);
