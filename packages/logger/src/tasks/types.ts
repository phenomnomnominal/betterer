import { ForegroundColor } from 'chalk';

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskStatusMessage = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskStatusMessages = ReadonlyArray<BettererTaskStatusMessage>;

export type BettererTaskError = Error & {
  details: string;
  message: string;
};

export type BettererTaskUpdate = (status: string) => void;

export type BettererTaskContext = {
  name: string;
  run: (logger: BettererTaskLogger) => Promise<BettererTaskStatusMessage | string | void>;
};

export type BettererTaskLogger = {
  status: BettererTaskUpdate;
  debug: BettererTaskUpdate;
  info: BettererTaskUpdate;
  warn: BettererTaskUpdate;
};
