import { BettererFilePaths, BettererFileResolver } from '../../fs';
import { BettererDiff } from '../../test';
import { MaybeAsync } from '../../types';
import { BettererTestBase, BettererTestConfig } from '../types';

export type BettererFileIssueSerialised = [line: number, column: number, length: number, message: string, hash: string];
export type BettererFileIssuesSerialised = ReadonlyArray<BettererFileIssueSerialised>;
export type BettererFileTestResultSerialised = Record<string, BettererFileIssuesSerialised>;

/**
 * @public A diff object for a single file.
 */
export type BettererFileDiff = {
  /**
   * The list of issues that have been fixed since the last run.
   */
  fixed?: BettererFileIssuesSerialised;
  /**
   * The list of issues that have not changed since the last run.
   */
  existing?: BettererFileIssuesSerialised;
  /**
   * The list of new issues since the last run.
   */
  new?: BettererFileIssuesSerialised;
};

/**
 * @public A map from file path to {@link @betterer/betterer#BettererFileDiff | `BettererFileDiff`}.
 */
export type BettererFilesDiff = Record<string, BettererFileDiff>;

/**
 * @public A diff object for a complete {@link @betterer/betterer#BettererFileTest | `BettererFileTest`} run.
 */
export type BettererFileTestDiff = BettererDiff<BettererFilesDiff>;

/**
 * @public A function that runs an actual file test.
 *
 * @param filePaths The relevant file paths for this test run. Determined by taking the input file
 * paths (defined by Watch mode or the {@link @betterer/betterer#BettererConfig | global `includes`/`excludes` config})
 * and then validating them with the test {@link @betterer/betterer#BettererFileTest.include | `BettererFileTest.include()` }
 * and {@link @betterer/betterer#BettererFileTest.exclude | `BettererFileTest.exclude()` }.
 * @param fileTestResult
 * @param resolver
 */
export type BettererFileTestFunction = (
  filePaths: BettererFilePaths,
  fileTestResult: BettererFileTestResult,
  resolver: BettererFileResolver
) => MaybeAsync<void>;

/**
 * @public An issue in a file
 */
export type BettererFileIssue = {
  /**
   * The `0`-indexed line number of the issue in the file.
   */
  readonly line: number;
  /**
   * The `0`-indexed column number in the line that has an issue.
   */
  readonly column: number;
  /**
   * The length of the substring that caused the issue.
   */
  readonly length: number;
  /**
   * A message that describes the issue.
   */
  readonly message: string;
  /**
   * A hash for the issue (usually the hash of the `message`). The `hash` is used for tracking
   * issues as they move around within a file.
   */
  readonly hash: string;
};

/**
 * @public An array of {@link @betterer/betterer#BettererFileIssue | `BettererFileIssue`s}.
 */
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
 * @public A set of {@link @betterer/betterer#BettererFile | `BettererFile`s} which each have their
 * own set of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`}.
 *
 * @remarks `DeserialisedType` of a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
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
