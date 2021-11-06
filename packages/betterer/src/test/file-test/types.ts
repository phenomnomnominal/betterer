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

/**
 * @public A function that runs an actual file test.
 */
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

/**
 * 
 */
export type BettererFileBase = {
  /**
   * The absolute path to the file.
   */
  readonly absolutePath: string;
  /**
   * The hash for the file (usually the hash of the file contents). The `hash` is used for tracking
   * files as they move around within a codebase.
   */
  readonly hash: string;
  /**
   * The set of issues for the file.
   */
  readonly issues: BettererFileIssues;
  /**
   * The key used for identifying the file in the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   */
  readonly key: string;
};

export type BettererFile = BettererFileBase & {
  addIssue(start: number, end: number, message: string, hash?: string): void;
  addIssue(line: number, col: number, length: number, message: string, hash?: string): void;
  addIssue(startLine: number, startCol: number, endLine: number, endCol: number, message: string, hash?: string): void;
};

/**
 * @public `DeserialisedType` of a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
 * It is a set of {@link @betterer/betterer#BettererFile | `BettererFile`s} which each have their
 * own set of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`}.
 */
export type BettererFileTestResult = {
  /**
   * Add a new file to the result set.
   *
   * @param absolutePath The absolute path to the file.
   * @param fileText The current text content of the file.
   */
  addFile(absolutePath: string, fileText: string): BettererFile;
  /**
   * Get the set of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`} for a file
   * at the given path.
   *
   * @param absolutePath The absolute path to the file. If not present, will return all issues for
   * all files.
   */
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
