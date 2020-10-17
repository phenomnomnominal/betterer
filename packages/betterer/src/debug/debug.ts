import { Module } from 'module';
import { BettererDebuggerΩ } from './debugger';
import { BettererDebugOptions, ModulePrivate } from './types';

export function debug(options: Partial<BettererDebugOptions>): void {
  if (options.enabled) {
    const d = new BettererDebuggerΩ(options);

    Object.keys(require.cache).forEach((requirePath) => {
      const module = require.cache[requirePath];
      return d.wrap(requirePath, module);
    });

    Module.prototype.require = (() => {
      const original = Module.prototype.require;
      const debugRequire = function (this: NodeModule, id: string): unknown {
        const requirePath = (Module as ModulePrivate)._resolveFilename(id, this);
        const module = original.apply(this, [id]) as unknown;
        return d.wrap(requirePath, module);
      };
      return Object.assign(debugRequire, original);
    })();
  }
}
