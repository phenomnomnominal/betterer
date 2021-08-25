import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { access, read } from './fs';
import { merge } from './merge';
import { requireText } from './require';
import { BettererResults } from './types';

const MERGE_CONFLICT_ANCESTOR = '|||||||';
const MERGE_CONFLICT_END = '>>>>>>>';
const MERGE_CONFLICT_SEP = '=======';
const MERGE_CONFLICT_START = '<<<<<<<';

export async function parse(resultsPath: string): Promise<BettererResults> {
  const exists = await access(resultsPath);
  if (!exists) {
    return {};
  }
  const contents = await read(resultsPath);

  if (hasMergeConflicts(contents)) {
    try {
      const [ours, theirs] = extractConflicts(contents);
      return merge(ours, theirs);
    } catch (e) {
      throw new BettererError(`could not resolve merge conflict in "${resultsPath}". 😔`, e);
    }
  }

  try {
    return requireText(contents);
  } catch {
    throw new BettererError(`could not read results from "${resultsPath}". 😔`);
  }
}

function hasMergeConflicts(str: string): boolean {
  return str.includes(MERGE_CONFLICT_START) && str.includes(MERGE_CONFLICT_SEP) && str.includes(MERGE_CONFLICT_END);
}

function extractConflicts(file: string): [string, string] {
  const ours = [];
  const theirs = [];
  const lines = file.split(/\r?\n/g);
  let skip = false;

  while (lines.length) {
    const line = lines.shift();
    assert(line != null);
    if (line.startsWith(MERGE_CONFLICT_START)) {
      // get our file
      while (lines.length) {
        const conflictLine = lines.shift();
        assert(conflictLine != null);
        if (conflictLine === MERGE_CONFLICT_SEP) {
          skip = false;
          break;
        } else if (skip || conflictLine.startsWith(MERGE_CONFLICT_ANCESTOR)) {
          skip = true;
          continue;
        } else {
          ours.push(conflictLine);
        }
      }

      // get their file
      while (lines.length) {
        const conflictLine = lines.shift();
        assert(conflictLine != null);
        if (conflictLine.startsWith(MERGE_CONFLICT_END)) {
          break;
        } else {
          theirs.push(conflictLine);
        }
      }
    } else {
      ours.push(line);
      theirs.push(line);
    }
  }
  return [ours.join('\n'), theirs.join('\n')];
}
