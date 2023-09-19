import { Module } from 'module';

interface ESModule<T> {
  default: T;
}
interface ModulePrivate {
  _compile(source: string, path: string): void;
}

export function importDefault<T>(importPath: string): T {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- migrating away from CJS requires
  const m = require(importPath) as unknown;
  return getDefaultExport<T>(m);
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
