import { Module } from 'module';
import path from 'node:path';

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
