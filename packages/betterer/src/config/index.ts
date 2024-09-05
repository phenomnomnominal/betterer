export type { BettererConfig, BettererOptionsOverride } from './types.js';

export { toArray, toRegExps } from './cast.js';
export {
  validateBool,
  validateFilePath,
  validateString,
  validateStringArray,
  validateStringRegExpArray,
  validateWorkers
} from './validate.js';
