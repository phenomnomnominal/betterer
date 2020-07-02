export const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;
