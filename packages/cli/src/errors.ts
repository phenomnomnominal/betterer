import { registerError } from '@betterer/errors';

export const COULDNT_WRITE_CONFIG_FILE = registerError(configPath => `could not read "${configPath}". 😔`);
export const COULDNT_FIND_PACKAGE_JSON = registerError(() => `could not find "package.json". 😔`);
export const COULDNT_READ_PACKAGE_JSON = registerError(() => `could not read "package.json". 😔`);
export const COULDNT_WRITE_PACKAGE_JSON = registerError(() => `could not write "package.json". 😔`);
