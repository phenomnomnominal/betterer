import { parseScript } from 'esprima';
import { query } from 'esquery';
import * as ESTree from 'estree';
import * as fs from 'fs';
import { Module, builtinModules } from 'module';
import * as path from 'path';
import { performance } from 'perf_hooks';
import { types, inspect } from 'util';

import { isFunction } from './utils';

type ModulePrivate = typeof Module & {
  _resolveFilename(id: string, module: NodeModule): string;
};

type Func = (...args: Array<unknown>) => unknown;
type Constructor = new (...args: Array<unknown>) => unknown;
type FuncMap = Record<string, Func | Constructor>;

export type BettererDebugOptions = {
  header: string;
  include?: Array<RegExp>;
  ignore?: Array<RegExp>;
};

export function debug(options: BettererDebugOptions): void {
  if (process.env.DEBUG) {
    const { header = '' } = options;
    print(`${header} starting ${Date.now()}`);

    Object.keys(require.cache).forEach((requirePath) => {
      const module = require.cache[requirePath];
      return wrapFunctions(options, requirePath, module);
    });

    Module.prototype.require = (() => {
      const original = Module.prototype.require;
      const debugRequire = function (this: NodeModule, id: string): unknown {
        const requirePath = (Module as ModulePrivate)._resolveFilename(id, this);
        const module = original.apply(this, [id]) as unknown;
        return wrapFunctions(options, requirePath, module);
      };
      return Object.assign(debugRequire, original);
    })();
  }
}

function wrapFunctions(options: BettererDebugOptions, requirePath: string, module: unknown): unknown {
  const { ignore = [], include = [] } = options;
  const isNodeModule = builtinModules.includes(requirePath) || requirePath.includes('node_modules');
  const isIncludedModule = include.some((regexp) => regexp.test(requirePath));
  const isIgnoredModule = ignore.some((regexp) => regexp.test(requirePath));
  if ((isNodeModule && !isIncludedModule) || isIgnoredModule) {
    return module;
  }

  const exports: FuncMap = module as FuncMap;
  const exportFunctions = getFunctions(exports);
  Object.keys(exportFunctions).forEach((functionName) => {
    Object.defineProperty(exports, functionName, {
      value: new Proxy(exports[functionName], {
        apply: createFunctionCallWrap(functionName),
        construct: createConstructorCallWrap(functionName)
      })
    });
  });
  return exports;
}

function wrapArgs(argNames: Array<string>, args: Array<unknown>): Array<unknown> {
  return args.map((arg, index) => {
    if (!isFunction<Func>(arg)) {
      return arg;
    }
    return new Proxy(arg, {
      apply: createFunctionCallWrap(argNames[index])
    });
  });
}

function createFunctionCallWrap(name: string): ProxyHandler<Func>['apply'] {
  return function wrapFunctionCall(target: Func, thisArg, args) {
    const startTime = start(name, args);
    const argNames = getArgNames(target);
    const result = target.apply(thisArg, wrapArgs(argNames, args));
    if (isPromise(result)) {
      return result.then((result) => {
        end(name, startTime, result);
        return result;
      });
    }
    end(name, startTime, result);
    return result;
  };
}

function createConstructorCallWrap(name: string): ProxyHandler<Constructor>['construct'] {
  return function (target: Constructor, args) {
    const startTime = start(name, args);
    const proto: FuncMap = target.prototype as FuncMap;
    const prototypeFunctions = getFunctions(proto);
    Object.keys(prototypeFunctions).forEach((functionName) => {
      Object.defineProperty(proto, functionName, {
        value: new Proxy(proto[functionName] as Func, {
          apply: createFunctionCallWrap(`${name}.${functionName}`)
        })
      });
    });
    const argNames = getArgNames(target);
    const instance = new target(...wrapArgs(argNames, args));
    end(name, startTime, instance);
    return instance as Constructor;
  };
}

function getArgNames(target: Func | Constructor): Array<string> {
  const [func] = query(parseScript(`var a = ${target.toString()}`), '[type=/Function/]') as Array<ESTree.Function>;
  return func.params.map((param) => {
    const [identifier] = query(param, 'Identifier') as Array<ESTree.Identifier>;
    return identifier.name;
  });
}

let depth = 0;
function start(name: string, args: Array<unknown>): number {
  depth += 1;
  let debugString = printDepth(depth, name);
  if (process.env.DEBUG_VALUES) {
    debugString += ` args: ${printObject(args)}`;
  }
  print(debugString);
  return performance.now();
}

function end(name: string, start: number, result: unknown): void {
  let debugString = printDepth(depth, name);
  if (process.env.DEBUG_TIME) {
    debugString += ` time: ${performance.now() - start}ms`;
  }
  if (process.env.DEBUG_VALUES) {
    debugString += ` return: ${printObject(result)}`;
  }
  print(debugString);
  depth -= 1;
}

function printDepth(depth: number, name: string): string {
  return `${'▸'.repeat(depth)} ${name}`;
}

function printObject(object: unknown): string {
  return inspect(object, { getters: true, depth: Infinity }).replace(/\n/g, '');
}

function print(toPrint: string): void {
  const printString = `${toPrint}\n`;
  if (process.env.DEBUG_LOG) {
    const logPath = path.resolve(process.cwd(), process.env.DEBUG_LOG);
    fs.appendFileSync(logPath, printString);
  } else {
    process.stdout.write(printString);
  }
}

function getFunctions(map: FuncMap): FuncMap {
  const functions: FuncMap = {} as FuncMap;
  Object.keys(map)
    .filter((functionName) => isFunction(map[functionName]) && !types.isProxy(map[functionName]))
    .forEach((functionName) => {
      functions[functionName] = map[functionName];
    });
  return functions;
}

function isPromise(value: unknown): value is Promise<unknown> {
  return types.isPromise(value);
}
