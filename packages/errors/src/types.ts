import { BettererError } from './error';

export type ErrorDetails = ReadonlyArray<unknown>;
export type ErrorFactory = (...details: ErrorDetails) => BettererError;
export type ErrorMessageFactory = (...details: ErrorDetails) => string;
