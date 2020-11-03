import * as assert from 'assert';
import { promises as fs } from 'fs';

import { requireText } from '../require';
import { COULDNT_READ_RESULTS, COULDNT_RESOLVE_MERGE_CONFLICT } from '../errors';
import { unescape } from './escaper';
import { BettererExpectedResults } from './types';

const MERGE_CONFLICT_ANCESTOR = '|||||||';
const MERGE_CONFLICT_END = '>>>>>>>';
const MERGE_CONFLICT_SEP = '=======';
const MERGE_CONFLICT_START = '<<<<<<<';

export async function read(resultsPath: string): Promise<BettererExpectedResults> {
  let file = '';
  try {
    file = await fs.readFile(resultsPath, 'utf-8');
  } catch {
    return {};
  }

  if (hasMergeConflicts(file)) {
    try {
      const [ours, theirs] = extractConflicts(file);
      return unescape({ ...requireText(ours), ...requireText(theirs) });
    } catch (e) {
      throw COULDNT_RESOLVE_MERGE_CONFLICT(resultsPath, e);
    }
  }

  try {
    return unescape(requireText(file));
  } catch {
    throw COULDNT_READ_RESULTS(resultsPath);
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
