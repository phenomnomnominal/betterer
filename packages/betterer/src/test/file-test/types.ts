import { BettererFilePaths, BettererFileResolver } from '../../fs';
import { BettererDiff } from '../../test';
import { MaybeAsync } from '../../types';
import { BettererTestBase, BettererTestConfig } from '../types';

export type BettererFileIssueSerialised = [line: number, column: number, length: number, message: string, hash: string];
export type BettererFileIssuesSerialised = ReadonlyArray<BettererFileIssueSerialised>;
export type BettererFileTestResultSerialised = Record<string, BettererFileIssuesSerialised>;

export type BettererFileDiff = {
  fixed?: BettererFileIssuesSerialised;
  existing?: BettererFileIssuesSerialised;
  new?: BettererFileIssuesSerialised;
};
export type BettererFilesDiff = Record<string, BettererFileDiff>;
export type BettererFileTestDiff = BettererDiff<BettererFilesDiff>;

export type BettererFileTestFunction = (
  filePaths: BettererFilePaths,
  fileTestResult: BettererFileTestResult,
  resolver: BettererFileResolver
) => MaybeAsync<void>;

export type BettererFileIssue = {
  readonly line: number;
  readonly column: number;
  readonly length: number;
  readonly message: string;
  readonly hash: string;
};

export type BettererFileIssues = ReadonlyArray<BettererFileIssue>;

export type BettererFileBase = {
  readonly absolutePath: string;
  readonly hash: string;
  readonly issues: BettererFileIssues;
  readonly key: string;
};

export type BettererFile = BettererFileBase & {
  addIssue(start: number, end: number, message: string, hash?: string): void;
  addIssue(line: number, col: number, length: number, message: string, hash?: string): void;
  addIssue(startLine: number, startCol: number, endLine: number, endCol: number, message: string, hash?: string): void;
};

export type BettererFileTestResult = {
  addFile(absolutePath: string, fileText: string): BettererFile;
  getIssues(absolutePath?: string): BettererFileIssues;
};

export type BettererFileTestBase = BettererTestBase<
  BettererFileTestResult,
  BettererFileTestResultSerialised,
  BettererFilesDiff
>;

export type BettererFileTestConfig = BettererTestConfig<
  BettererFileTestResult,
  BettererFileTestResultSerialised,
  BettererFilesDiff
>;
