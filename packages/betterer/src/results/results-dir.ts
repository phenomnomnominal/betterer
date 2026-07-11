import type { BettererFilePath } from '../fs/index.js';
import type { BettererRun, BettererRunΩ } from '../run/index.js';
import type {
  BettererFileIssueSerialised,
  BettererFileTestResultKey,
  BettererFileTestResultSerialised,
  BettererTestNames
} from '../test/index.js';
import type { BettererResults, BettererResultSerialised, BettererResultsSerialised } from './types.js';

import { BettererError, invariantΔ } from '@betterer/errors';
import path from 'node:path';
import { promises as fs } from 'node:fs';

import { read, removeDir, syncDir, walkDir } from '../fs/index.js';
import { createHash } from '../hasher.js';
import { decodeSlug, encodeSlug, splitKey } from '../test/index.js';

const VALUE_FILE = 'value.json';
const EMPTY_MARKER = '.empty';
const CONTENT_HASH_PLACEHOLDER = 'dir';
const MERGE_CONFLICT_MARKER = /^<{7}/m;

// Directory-based results backend. Each test is a directory named by its `slug`, holding a `value.json`
// for a value test, or one file per issue for a file test. One file per issue means concurrent edits
// merge cleanly with a plain three-way merge:
export class BettererResultsDir implements BettererResults {
  private readonly _baseline: BettererResultsSerialised;
  private _expected: BettererResultsSerialised;
  private _staged = new Map<string, [BettererRun, string]>();

  private constructor(
    private readonly _dirPath: BettererFilePath,
    baseline: BettererResultsSerialised
  ) {
    this._baseline = baseline;
    this._expected = baseline;
  }

  public static async create(resultsDir: BettererFilePath): Promise<BettererResultsDir> {
    const baseline = await readResults(resultsDir);
    return new BettererResultsDir(resultsDir, baseline);
  }

  public set(run: BettererRun, value: string): void {
    this._staged.set(run.name, [run, value]);
  }

  public async write(): Promise<string | null> {
    const staged = this._staged;
    this._staged = new Map();

    const results: BettererResultsSerialised = {};
    staged.forEach(([, value], name) => {
      results[name] = { value };
    });

    const removedNames = Object.keys(this._expected).filter((name) => !Object.hasOwnProperty.call(results, name));

    // Remove before writing: a rename can resolve to the same directory on a case-insensitive filesystem.
    await Promise.all(removedNames.map((name) => removeDir(this._testDir(encodeSlug(name)))));
    const writes = await Promise.all(Array.from(staged, ([, [run, value]]) => this._writeResult(run, value)));

    this._expected = results;
    if (removedNames.length > 0 || writes.includes(true)) {
      return this._dirPath;
    }
    return null;
  }

  public getBaseline(name: string): string {
    return this._getResult(name, this._baseline);
  }

  public getExpected(name: string): string {
    return this._getResult(name, this._expected);
  }

  public getExpectedTestNames(): BettererTestNames {
    return Object.keys(this._expected);
  }

  public hasBaseline(name: string): boolean {
    return Object.hasOwnProperty.call(this._baseline, name);
  }

  private async _writeResult(run: BettererRun, value: string): Promise<boolean> {
    if (run.isObsolete) {
      return false;
    }
    const runΩ = run as BettererRunΩ;
    const testDir = this._testDir(runΩ.testMeta.slug);
    if (runΩ.runMeta.isFileTest) {
      return await syncDir(testDir, issueFiles(value));
    }
    return await syncDir(testDir, new Map([[VALUE_FILE, `${JSON.stringify({ value })}\n`]]));
  }

  private _testDir(slug: string): string {
    return path.join(this._dirPath, slug);
  }

  private _getResult(name: string, results: BettererResultsSerialised): string {
    const result = results[name];
    invariantΔ(result, `result for test "${name}" should exist!`);
    return result.value;
  }
}

async function readResults(dirPath: string): Promise<BettererResultsSerialised> {
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return {};
  }
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const results: BettererResultsSerialised = {};
  await Promise.all(
    slugs.map(async (slug) => {
      const result = await readResult(path.join(dirPath, slug));
      if (result !== null) {
        results[decodeSlug(slug)] = result;
      }
    })
  );
  return results;
}

async function readResult(testDir: string): Promise<BettererResultSerialised | null> {
  const valueFile = path.join(testDir, VALUE_FILE);
  const contents = await read(valueFile);
  if (contents !== null) {
    try {
      return JSON.parse(contents) as BettererResultSerialised;
    } catch (error) {
      throw new BettererError(`could not read results from "${valueFile}". 😔`, error as Error);
    }
  }
  const filePaths = await walkDir(testDir);
  const hasEmptyMarker = filePaths.some((filePath) => path.basename(filePath) === EMPTY_MARKER);
  const issuePaths = filePaths.filter((filePath) => path.basename(filePath) !== EMPTY_MARKER);
  const issues = await readIssues(testDir, issuePaths);
  if (Object.keys(issues).length > 0) {
    return { value: JSON.stringify(issues) };
  }
  if (hasEmptyMarker) {
    return { value: '{}' };
  }
  return null;
}

async function readIssues(
  testDir: string,
  issuePaths: ReadonlyArray<string>
): Promise<BettererFileTestResultSerialised> {
  const issueEntries = (
    await Promise.all(
      issuePaths.map(async (filePath) => {
        const fullPath = path.join(testDir, filePath);
        const contents = await read(fullPath);
        if (contents === null) {
          return null;
        }
        if (MERGE_CONFLICT_MARKER.test(contents)) {
          throw new BettererError(`could not read results from "${fullPath}", it contains a merge conflict. 😔`);
        }
        let issue: BettererFileIssueSerialised;
        try {
          issue = JSON.parse(contents) as BettererFileIssueSerialised;
        } catch {
          return null;
        }
        const segments = filePath.split('/');
        segments.pop();
        const relativePath = segments.map(decodeSlug).join('/');
        const key: BettererFileTestResultKey = `${relativePath}:${CONTENT_HASH_PLACEHOLDER}`;
        return { key, issue };
      })
    )
  ).filter((issueEntry) => issueEntry !== null);

  issueEntries.sort((entryA, entryB) => {
    const [lineA, columnA] = entryA.issue;
    const [lineB, columnB] = entryB.issue;
    if (lineA !== lineB) {
      return lineA - lineB;
    }
    return columnA - columnB;
  });

  const serialised: Record<BettererFileTestResultKey, Array<BettererFileIssueSerialised>> = {};
  issueEntries.forEach(({ key, issue }) => {
    const issues = serialised[key] ?? [];
    issues.push(issue);
    serialised[key] = issues;
  });
  return serialised;
}

function issueFiles(value: string): Map<string, string> {
  const files = new Map<string, string>();
  const serialised = JSON.parse(value) as BettererFileTestResultSerialised;
  Object.entries(serialised).forEach(([key, issues]) => {
    const { relativePath } = splitKey(key as BettererFileTestResultKey);
    const dir = relativePath.split('/').map(encodeSlug).join('/');
    issues.forEach((issue) => {
      const serialisedIssue = JSON.stringify(issue);
      files.set(`${dir}/${createHash(serialisedIssue)}`, `${serialisedIssue}\n`);
    });
  });
  if (files.size === 0) {
    files.set(EMPTY_MARKER, '');
  }
  return files;
}
