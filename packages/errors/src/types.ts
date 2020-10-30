import { BettererError } from './error';

export type BettererErrorDetail = string | ErrorLike | BettererError;
export type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;

export type ErrorLike = {
  message: string;
  stack: string;
};
