import { betterer } from '@betterer/betterer';
import { Files } from 'vscode-languageserver/node';

import { nodeRequire } from '../utils';
import { trace } from './trace';

export type BettererLibrary = typeof betterer;
type BettererModule = { betterer: BettererLibrary };

const pathToLibrary = new Map<string, BettererLibrary>();

export async function getLibrary(cwd: string): Promise<BettererLibrary> {
  if (pathToLibrary.has(cwd)) {
    return pathToLibrary.get(cwd) as BettererLibrary;
  }
  const libraryPath = await Files.resolve('@betterer/betterer', undefined, cwd, trace);
  const r = nodeRequire();
  const library = r(libraryPath) as BettererModule;
  const bettererLibrary = library.betterer;
  pathToLibrary.set(cwd, bettererLibrary);
  return bettererLibrary;
}
