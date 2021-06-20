/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from 'module';

type ESModule<T> = {
  default: T;
};

export function requireUncached<T>(requirePath: string): T {
  delete require.cache[require.resolve(requirePath)];
  const m = require(requirePath) as unknown;
  return getDefaultExport<T>(m);
}

type ModulePrivate = {
  _compile(source: string, path: string): void;
};

let count = 0;
export function requireText<T>(text: string): T {
  const id = `${count++}`;
  const m = new Module(id);
  (m as unknown as ModulePrivate)._compile(text, id);
  return getDefaultExport<T>(m.exports);
}

function getDefaultExport<T>(module: unknown): T {
  return (module as ESModule<T>).default || (module as T);
}
