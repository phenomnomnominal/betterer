import { registerError } from '@betterer/errors';

// TODO:
export const COULDNT_FIND_PACKAGE_JSON = registerError(() => '');
export const COULDNT_READ_PACKAGE_JSON = registerError(() => '');
export const COULDNT_WRITE_CONFIG_FILE = registerError(() => '');
export const COULDNT_WRITE_PACKAGE_JSON = registerError(() => '');
