import { Files } from 'vscode-languageserver';

import { betterer } from '@betterer/betterer';
import { nodeRequire } from './require';
import { trace } from './trace';

type Betterer = typeof betterer;

const pathToLibrary = new Map<string, Betterer>();

export async function getLibrary(cwd: string): Promise<Betterer> {
  if (pathToLibrary.has(cwd)) {
    return pathToLibrary.get(cwd) as Betterer;
  }
  const libraryPath = await Files.resolve('@betterer/betterer', undefined, cwd, trace);
  try {
    const r = nodeRequire();
    const library = r(libraryPath);
    const bettererRunner = library.betterer;
    pathToLibrary.set(cwd, bettererRunner);
    return bettererRunner as Betterer;
  } catch {
    throw new Error();
  }
}
