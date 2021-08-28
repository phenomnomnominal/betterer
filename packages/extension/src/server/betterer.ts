import { betterer, BettererOptionsRunner, BettererRunner } from '@betterer/betterer';
import { Files } from 'vscode-languageserver/node';

import { nodeRequire } from '../utils';
import { trace } from './trace';

type BettererLibrary = typeof betterer;
type BettererModule = { betterer: BettererLibrary };

const PATH_TO_LIB = new Map<string, BettererLibrary>();
const RUNNERS = new Map<string, BettererRunner>();

export async function hasBetterer(cwd: string): Promise<boolean> {
  const libraryPath = await getLibraryPath(cwd);
  return !!libraryPath;
}

export async function getRunner(config: BettererOptionsRunner): Promise<BettererRunner> {
  const key = JSON.stringify(config);
  if (RUNNERS.has(key)) {
    return RUNNERS.get(key) as BettererRunner;
  }
  const { runner } = await getLibrary(config.cwd as string);
  const toCache = await runner(config);
  RUNNERS.set(key, toCache);
  return toCache;
}

async function getLibraryPath(cwd: string): Promise<string> {
  return await Files.resolve('@betterer/betterer', undefined, cwd, trace);
}

async function getLibrary(cwd: string): Promise<BettererLibrary> {
  if (PATH_TO_LIB.has(cwd)) {
    return PATH_TO_LIB.get(cwd) as BettererLibrary;
  }
  const libraryPath = await getLibraryPath(cwd);
  const r = nodeRequire();
  const library = r(libraryPath) as BettererModule;
  const bettererLibrary = library.betterer;
  PATH_TO_LIB.set(cwd, bettererLibrary);
  return bettererLibrary;
}
