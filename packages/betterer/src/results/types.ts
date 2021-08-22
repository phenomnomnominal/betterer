import { BettererFileIssues } from '../test';

export type BettererExpectedResult = {
  value: string;
};
export type BettererExpectedResults = Record<string, BettererExpectedResult>;

export type BettererResult = {
  isNew: boolean;
  value: unknown;
};

export type BettererResults = {
  results: BettererTestResults;
};

export type BettererTestResults = ReadonlyArray<BettererTestResult>;

export type BettererTestResult =
  | {
      name: string;
      isFileTest: true;
      results: BettererFileTestResults;
    }
  | {
      name: string;
      isFileTest: false;
      result: string;
    };

export type BettererFileTestResults = Record<string, BettererFileIssues>;
