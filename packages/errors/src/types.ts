import { BettererError } from './error';

export type BettererErrorDetails = ReadonlyArray<string | Error | BettererError>;
export type BettererErrorFactory = (...details: BettererErrorDetails) => BettererError;
export type BettererErrorMessageFactory = (...details: BettererErrorDetails) => string;
