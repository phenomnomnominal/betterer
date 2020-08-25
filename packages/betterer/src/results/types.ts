export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;

export type BettererDiff<DeserialisedType = unknown, DiffType = null> = {
  expected: DeserialisedType;
  result: DeserialisedType;
  diff: DiffType;
  log: () => void;
};

export type BettererResult = {
  isNew: boolean;
  value: unknown;
};
