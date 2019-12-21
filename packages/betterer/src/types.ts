export type MaybeAsync<T> = T | Promise<T>;

export type BettererResult = {
  timestamp: number;
  value: unknown;
};

export type BettererResults = Record<string, BettererResult>;
