import { BettererFileIssues } from '../test';

export type BettererResult = {
  isNew: boolean;
  value: unknown;
};

export type BettererResultsSummary = {
  testResultSummaries: BettererTestResultSummaries;
};

export type BettererTestResultSummaries = ReadonlyArray<BettererTestResultSummary>;

export type BettererTestResultSummary =
  | {
      name: string;
      isFileTest: true;
      summary: BettererFileTestResultSummary;
    }
  | {
      name: string;
      isFileTest: false;
      summary: string;
    };

export type BettererFileTestResultSummary = Record<string, BettererFileIssues>;
