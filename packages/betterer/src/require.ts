/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from 'module';

export function requireUncached<T>(requirePath: string): T {
  delete require.cache[require.resolve(requirePath)];
  const m = require(requirePath);
  return m.default || m;
}

type ModulePrivate = {
  _compile(source: string, path: string): void;
};

let count = 0;
export function requireText<T>(text: string): T {
  const id = `${count++}`;
  const m = new Module(id);
  ((m as unknown) as ModulePrivate)._compile(text, id);
  return m.exports.default || m.exports;
}
