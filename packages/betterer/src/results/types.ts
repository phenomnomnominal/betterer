export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;

export type BettererResultValueBasic = number;
export type BettererResultValueComplex = {
  value: number;
};
export type BettererResultValue = BettererResultValueBasic | BettererResultValueComplex;

export type BettererResult = {
  isNew: boolean;
  value: unknown;
  result: BettererResultValue;
};
