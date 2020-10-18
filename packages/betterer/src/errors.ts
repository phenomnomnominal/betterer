import { registerError } from '@betterer/errors';

export const CONSTRAINT_FUNCTION_REQUIRED = registerError(
  () => 'for a test to work, it must have a `constraint` function. ❌'
);
export const GOAL_FUNCTION_REQUIRED = registerError(() => 'for a test to work, it must have a `goal` function. ❌');
export const TEST_FUNCTION_REQUIRED = registerError(() => 'for a test to work, it must have a `test` function. ❌');

export const COULDNT_READ_CONFIG = registerError(
  (configPath) => `could not read config from "${configPath as string}". 😔`
);
export const COULDNT_READ_RESULTS = registerError(
  (resultsPath) => `could not read results from "${resultsPath as string}". 😔`
);
export const COULDNT_WRITE_RESULTS = registerError(
  (resultsPath) => `could not write results to "${resultsPath as string}". 😔`
);

export const COULDNT_LOAD_REPORTER = registerError(
  (reporterName) => `could not require "${reporterName as string}". 😔`
);
export const NO_REPORTER_LOADED = registerError(
  (reporterName) => `"${reporterName as string}" didn't create a reporter. 😔`
);
export const UNKNOWN_HOOK_NAME = registerError(
  (hookName) => `"${hookName as string}" is not a valid reporter hook name. 😔`
);
export const HOOK_NOT_A_FUNCTION = registerError((hookName) => `"${hookName as string}" is not a function. 😔`);

export const COULDNT_RESOLVE_MERGE_CONFLICT = registerError(
  (resultsPath) => `could not resolve merge conflict in "${resultsPath as string}". 😔`
);
