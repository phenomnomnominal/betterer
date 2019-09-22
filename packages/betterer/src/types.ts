type BetterTest<T = unknown> = () => T | Promise<T>;
type BetterConstraint<T = unknown> = (
  current: T,
  previous: T
) => boolean | Promise<boolean>;

export type Betterer<T = number> = {
  test: BetterTest<T>;
  constraint: BetterConstraint<T>;
  goal: T;
};

export type BetterTests = {
  [key: string]: Betterer;
};

export type BetterConfig = {
  configPath: string;
  resultsPath?: string;
  filters?: Array<RegExp>;
};

type BetterResult = {
  timestamp: number;
  value: string;
};

export type BetterResults = Record<string, BetterResult>;

export type BetterStats = {
  obsolete: Array<string>;
  ran: Array<string>;
  failed: Array<string>;
  new: Array<string>;
  better: Array<string>;
  same: Array<string>;
  worse: Array<string>;
  messages: Array<string>;
  completed: Array<string>;
};
