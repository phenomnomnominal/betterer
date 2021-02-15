export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;

export type BettererResultValueBasic = unknown;
export type BettererResultValueComplex = {
  value: unknown;
};
export type BettererResultValue = BettererResultValueBasic | BettererResultValueComplex;

export type BettererResult = {
  isNew: boolean;
  value: unknown;
  result: BettererResultValue;
};
