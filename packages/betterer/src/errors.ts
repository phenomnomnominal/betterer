import { registerError } from '@betterer/errors';

export const CONSTRAINT_FUNCTION_REQUIRED = registerError(
  () => 'for a test to work, it must have a `constraint` function. ❌'
);
export const TEST_FUNCTION_REQUIRED = registerError(() => 'for a test to work, it must have a `test` function. ❌');

export const COULDNT_READ_CONFIG = registerError((configPath) => `could not read config from "${configPath}". 😔`);
export const COULDNT_READ_RESULTS = registerError((resultsPath) => `could not read results from "${resultsPath}". 😔`);
export const COULDNT_WRITE_RESULTS = registerError((resultsPath) => `could not write results to "${resultsPath}". 😔`);

export const COULDNT_LOAD_REPORTER = registerError((reporterName) => `could not require "${reporterName}". 😔`);
export const NO_REPORTER_LOADED = registerError((reporterName) => `"${reporterName}" didn't create a reporter. 😔`);
export const UNKNOWN_HOOK_NAME = registerError((hookName) => `"${hookName}" is not a valid reporter hook name. 😔`);
export const HOOK_NOT_A_FUNCTION = registerError((hookName) => `"${hookName}" is not a function. 😔`);

export const COULDNT_RESOLVE_MERGE_CONFLICT = registerError(
  (resultsPath) => `could not resolve merge conflict in "${resultsPath}". 😔`
);
