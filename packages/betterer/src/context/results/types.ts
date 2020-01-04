type BettererResult = {
  timestamp: number;
  value: unknown;
};

export type BettererResults = Record<string, BettererResult>;
export type BettererResultsValues = Record<string, unknown>;
