import { BettererError } from '@betterer/errors';
import { Module } from 'module';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { read } from './reader.js';
import { getTmpFileName } from './temp.js';

interface ESModule<T> {
  default: T;
}
interface ModulePrivate {
  _compile(source: string, path: string): void;
}

const TYPESCRIPT_EXTENSIONS = ['.ts', '.tsx', '.cts', '.ctsx', '.mtx', '.mtsx'];

export async function importDefault<T>(importPath: string): Promise<T> {
  const ext = path.extname(importPath);

  if (TYPESCRIPT_EXTENSIONS.find((tsExt) => ext.endsWith(tsExt))) {
    try {
      return importTypeScript<T>(importPath);
    } catch (error) {
      throw new BettererError(`could not import "${importPath}". 😔`, error as Error);
    }
  }

  // Maybe a real module:
  const m = (await import(importPath)) as unknown;
  return getDefaultExport<T>(m);
}

export async function importTypeScript<T>(importPath: string): Promise<T> {
  try {
    await import('typescript');
  } catch (error) {
    throw new BettererError(
      'could not import "typescript". You might need to add it as a dependency in your project. 😔',
      error as Error
    );
  }

  const source = await read(importPath);
  if (source === null) {
    throw new BettererError(`could not read "${importPath}". 😔`);
  }

  const typescript = await import('typescript');
  const { transpileModule, ModuleKind } = getDefaultExport<typeof import('typescript')>(typescript);
  const options = { compilerOptions: { module: ModuleKind.ES2015 } };
  const transpiled = transpileModule(source, options).outputText;

  const tmpFile = path.join(path.dirname(importPath), getTmpFileName());
  try {
    await fs.writeFile(tmpFile, transpiled);
    return await importDefault(tmpFile);
  } catch (error) {
    throw new BettererError(`could not import "${importPath}". 😔`, error as Error);
  } finally {
    await fs.rm(tmpFile);
  }
}

let count = 0;
export function importText<T>(filePath: string, text: string): T {
  const id = `${count++}`;
  const { base, dir, ext } = path.parse(filePath);
  const m = new Module(path.join(dir, `${base}.${id}.${ext}`));
  (m as unknown as ModulePrivate)._compile(text, id);
  return getDefaultExport<T>(m.exports);
}

export function getDefaultExport<T>(module: unknown): T {
  return (module as ESModule<T>).default || (module as T);
}
