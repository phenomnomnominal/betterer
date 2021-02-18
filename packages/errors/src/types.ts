import { BettererError } from './error';

export type BettererErrorDetail = string | Error | BettererError;
export type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;
