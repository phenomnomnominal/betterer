import { promises as fs } from 'fs';
import { Module } from 'module';

import { COULDNT_READ_RESULTS } from '../errors';
import { BettererExpectedResults } from './types';

type ModulePrivate = {
  _compile(source: string, path: string): void;
};

export async function read(resultsPath: string): Promise<BettererExpectedResults> {
  let file = '';
  try {
    file = await fs.readFile(resultsPath, 'utf-8');
  } catch {
    return {};
  }

  try {
    const m = new Module(resultsPath);
    ((m as unknown) as ModulePrivate)._compile(file, resultsPath);
    return m.exports;
  } catch {
    throw COULDNT_READ_RESULTS(resultsPath);
  }
}
