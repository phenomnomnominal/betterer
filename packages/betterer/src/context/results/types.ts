export type BettererResults = Record<string, BettererResult>;

type BettererResult = {
  timestamp: number;
  value: unknown;
};
