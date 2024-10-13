import { BettererError } from '@betterer/errors';
import * as esbuild from 'esbuild';
import { promises as fs } from 'node:fs';
import { Module } from 'node:module';
import path from 'node:path';

import { createHash } from '../hasher.js';
import { read } from './reader.js';
import { getTmpFileName } from './temp.js';

export interface ESModule {
  default: unknown;
}

export interface ModulePrivate {
  _compile(source: string, path: string): void;
}

export async function importTranspiledHashed(importPath: string): Promise<[unknown, string]> {
  try {
    return await importFrom(importPath);
  } catch (error) {
    throw new BettererError(`could not import "${importPath}". 😔`, error as Error);
  }
}

export async function importTranspiled(importPath: string): Promise<unknown> {
  try {
    const [result] = await importFrom(importPath);
    return result;
  } catch (error) {
    throw new BettererError(`could not import "${importPath}". 😔`, error as Error);
  }
}

export async function importDefault(importPath: string): Promise<unknown> {
  try {
    const m = (await import(importPath)) as unknown;
    return getDefaultExport(m);
  } catch (error) {
    throw new BettererError(`could not import "${importPath}". 😔`, error as Error);
  }
}

let count = 0;
export function importText(filePath: string, text: string): unknown {
  const id = String(count++);
  const { base, dir, ext } = path.parse(filePath);
  const m = new Module(path.join(dir, `${base}.${id}.${ext}`));
  (m as unknown as ModulePrivate)._compile(text, id);
  return getDefaultExport(m.exports);
}

function getDefaultExport(module: unknown): unknown {
  return (module as ESModule).default || module;
}

async function importFrom(importPath: string): Promise<[unknown, string]> {
  const contents = await read(importPath);
  if (contents == null) {
    throw new BettererError(`could not read "${importPath}". 😔`);
  }

  const outfile = getTmpFileName(importPath, '.mjs');
  const cleanup = async () => {
    await fs.rm(outfile);
  };

  try {
    await esbuild.build({
      bundle: true,
      format: 'esm',
      entryPoints: [importPath],
      outfile,
      packages: 'external',
      platform: 'node',
      logLevel: 'silent'
    });

    const transpiled = await read(outfile);
    if (transpiled === null) {
      throw new BettererError(`could not read "${importPath}". 😔`);
    }

    const hash = createHash(transpiled);
    const result = await importDefault(outfile);
    return [result, hash];
  } catch (error) {
    const failure = error as esbuild.BuildFailure;
    const [first] = failure.errors;
    throw new BettererError(first ? first.text : failure.message);
  } finally {
    try {
      await cleanup();
    } catch {
      // No file was actually created!
    }
  }
}
