export type { BettererConfig, BettererOptionsOverride } from './types.js';

export { toArray, toRegExps } from './cast.js';
export {
  validateBool,
  validateString,
  validateFilePath,
  validateStringArray,
  validateStringRegExpArray,
  validateWorkers
} from './validate.js';
