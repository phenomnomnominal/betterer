import { Module } from 'module';

interface ESModule<T> {
  default: T;
}

interface ModulePrivate {
  _compile(source: string, path: string): void;
}

let count = 0;
export function requireText<T>(text: string): T {
  const id = `${count++}`;
  const m = new Module(id);
  (m as unknown as ModulePrivate)._compile(text, id);
  return getDefaultExport<T>(m.exports);
}

export function getDefaultExport<T>(module: unknown): T {
  return (module as ESModule<T>).default || (module as T);
}
