import { registerError } from '@betterer/errors';

// TODO:
export const NO_CONSTRAINT = registerError(() => '');
export const NO_TEST = registerError(() => '');

export const CANT_READ_CONFIG = registerError(
  configPath => `could not read "${configPath}". 😔`
);
export const CANT_READ_RESULTS = registerError(
  resultsPath => `could not read results from "${resultsPath}". 😔`
);
export const CANT_WRITE_RESULTS = registerError(
  resultsPath => `could not write results to "${resultsPath}". 😔`
);

// TODO:
export const CANNOT_CALL_GET_FILE_INFO_ON_SERIALISED_BETTERER_FILE = registerError(
  () => ''
);
