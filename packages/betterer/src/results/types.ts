export const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export type BettererResult = {
  timestamp: number;
  value: unknown;
};
export type BettererResults = Record<string, BettererResult>;
export type BettererExpectedResult =
  | {
      timestamp: number;
      value: string;
    }
  | typeof NO_PREVIOUS_RESULT;
export type BettererExpectedResults = Record<string, BettererExpectedResult>;
