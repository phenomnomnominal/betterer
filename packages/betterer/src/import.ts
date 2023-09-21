import { Module, createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BettererError } from '@betterer/errors';

interface ESModule<T> {
  default: T;
}

interface ModulePrivate {
  _compile(source: string, path: string): void;
}

export async function importDefault<T>(importPath: string): Promise<T> {
  const m = (await import(importPath)) as unknown;
  return getDefaultExport<T>(m);
}

const IMPORT_EXTENSIONS = ['', '.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs'];

export function importResolve(importPath: string): string {
  const require = createRequire(import.meta.url);

  for (const extension of IMPORT_EXTENSIONS) {
    try {
      return require.resolve(`${importPath}${extension}`);
    } catch {
      // Hopefully one of these succeeds lol 🥰
    }
  }

  throw new BettererError(`could not resolve path to "${importPath}". 😔`);
}

export async function importUncached<T>(importPath: string): Promise<T> {
  const resolvedPath = importResolve(importPath);
  const fileContent = await fs.readFile(resolvedPath, 'utf8');

  const ext = path.extname(resolvedPath);
  const dir = path.dirname(resolvedPath);
  const base = path.basename(resolvedPath, ext);
  const newFilepath = path.join(dir, `${base}.${Date.now()}${ext}`);

  await fs.writeFile(newFilepath, fileContent);
  try {
    const module: unknown = await import(newFilepath);
    return getDefaultExport<T>(module);
  } finally {
    await fs.unlink(newFilepath);
  }
}

let count = 0;
export function importText<T>(text: string): T {
  const id = `${count++}`;
  const m = new Module(id);
  (m as unknown as ModulePrivate)._compile(text, id);
  return getDefaultExport<T>(m.exports);
}

export function getDefaultExport<T>(module: unknown): T {
  return (module as ESModule<T>).default || (module as T);
}
