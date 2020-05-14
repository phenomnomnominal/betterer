import { registerError } from '@betterer/errors';

export const CONSTRAINT_FUNCTION_REQUIRED = registerError(
  () => 'for a test to work, it must have a `constraint` function. ❌'
);
export const TEST_FUNCTION_REQUIRED = registerError(() => 'for a test to work, it must have a `test` function. ❌');

export const COULDNT_READ_CONFIG = registerError((configPath) => `could not read config from "${configPath}". 😔`);
export const COULDNT_READ_RESULTS = registerError((resultsPath) => `could not read results from "${resultsPath}". 😔`);
export const COULDNT_WRITE_RESULTS = registerError((resultsPath) => `could not write results to "${resultsPath}". 😔`);
