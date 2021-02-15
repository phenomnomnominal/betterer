export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;

export type BettererResult = {
  isNew: boolean;
  value: unknown;
};
