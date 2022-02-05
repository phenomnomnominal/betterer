import { BettererError } from '@betterer/errors';
import assert from 'assert';
import * as os from 'os';
import * as path from 'path';

import { BettererVersionControlWorker, read } from '../fs';
import { registerExtensions } from './register';
import { BettererReporter, loadReporters, loadSilentReporter } from '../reporters';
import { isBoolean, isNumber, isRegExp, isString, isUndefined } from '../utils';
import {
  BettererConfig,
  BettererConfigBase,
  BettererConfigMerge,
  BettererConfigStart,
  BettererConfigWatch,
  BettererOptionsBase,
  BettererOptionsMerge,
  BettererOptionsOverride,
  BettererOptionsStart,
  BettererOptionsWatch,
  BettererWorkerRunConfig
} from './types';

const TOTAL_CPUS = os.cpus().length;

export async function createConfig(
  options: unknown = {},
  versionControl: BettererVersionControlWorker
): Promise<BettererConfig> {
  const tsconfigPath = resolveTsConfigPath(options as BettererOptionsBase);
  await registerExtensions(tsconfigPath);

  const baseConfig = await createBaseConfig(options as BettererOptionsBase, tsconfigPath, versionControl);
  const startConfig = createStartConfig(options as BettererOptionsStart);
  const watchConfig = createWatchConfig(options as BettererOptionsWatch);

  const config = { ...baseConfig, ...startConfig, ...watchConfig };

  modeConfig(config);

  if (config.tsconfigPath) {
    await validateFilePath({ tsconfigPath: config.tsconfigPath });
  }

  return config;
}

export function overrideConfig(config: BettererConfig, optionsOverride: BettererOptionsOverride): void {
  if (optionsOverride.filters) {
    validateStringRegExpArray({ filters: optionsOverride.filters });
    config.filters = toRegExps(toArray<string | RegExp>(optionsOverride.filters));
  }

  if (optionsOverride.ignores) {
    validateStringArray({ ignores: optionsOverride.ignores });
    config.ignores = toArray<string>(optionsOverride.ignores);
  }

  if (optionsOverride.reporters) {
    const reporters = toArray<string | BettererReporter>(optionsOverride.reporters);
    config.reporter = loadReporters(reporters, config.cwd);
  }
}

function resolveTsConfigPath(options: BettererOptionsBase): string | null {
  const cwd = options.cwd || process.cwd();
  const tsconfigPath = options.tsconfigPath || null;
  return tsconfigPath ? path.resolve(cwd, tsconfigPath) : null;
}

async function createBaseConfig(
  options: BettererOptionsBase,
  tsconfigPath: string | null,
  versionControl: BettererVersionControlWorker
): Promise<BettererConfigBase> {
  const cwd = options.cwd || process.cwd();
  const configPaths = options.configPaths ? toArray<string>(options.configPaths) : ['./.betterer'];

  validateStringArray({ configPaths });

  const isDebug = !!process.env.BETTERER_DEBUG;
  const cache = !!options.cachePath || options.cache || false;
  const cachePath = options.cachePath || './.betterer.cache';
  const filters = toRegExps(toArray<string | RegExp>(options.filters));
  const reporters = toArray<string | BettererReporter>(options.reporters);
  const silent = isDebug || options.silent || false;
  const reporter = silent ? loadSilentReporter() : loadReporters(reporters, cwd);
  const resultsPath = options.resultsPath || './.betterer.results';

  validateBool({ cache });
  validateString({ cachePath });
  validateString({ cwd });
  validateStringRegExpArray({ filters });
  validateString({ resultsPath });
  validateBool({ silent });
  const workers = validateWorkers(options);

  const validatedConfigPaths = validateConfigPaths(cwd, configPaths);
  const versionControlPath = await versionControl.init(validatedConfigPaths);

  return {
    cache,
    cachePath: path.resolve(cwd, cachePath),
    cwd,
    configPaths: validatedConfigPaths,
    filters,
    reporter,
    resultsPath: path.resolve(cwd, resultsPath),
    tsconfigPath,
    versionControlPath,
    workers
  };
}

export async function createMergeConfig(options: BettererOptionsMerge): Promise<BettererConfigMerge> {
  const contents = toArray(options.contents);
  const cwd = options.cwd || process.cwd();
  const resultsPath = path.resolve(cwd, options.resultsPath || './.betterer.results');

  validateStringArray({ contents });
  await validateFilePath({ resultsPath });

  return {
    contents,
    resultsPath: path.resolve(cwd, resultsPath)
  };
}

export async function createWorkerConfig(config: BettererWorkerRunConfig): Promise<BettererConfig> {
  await registerExtensions(config.tsconfigPath);

  return {
    ...config,
    reporter: loadSilentReporter(),
    workers: 1
  };
}

function createStartConfig(options: BettererOptionsStart): BettererConfigStart {
  const ci = options.ci || false;
  const excludes = toRegExps(toArray<string | RegExp>(options.excludes)) || [];
  const includes = toArray<string>(options.includes) || [];
  const precommit = options.precommit || false;
  const strict = options.strict || false;
  const update = options.update || false;

  validateBool({ ci });
  validateStringRegExpArray({ excludes });
  validateStringArray({ includes });
  validateBool({ precommit });
  validateBool({ strict });
  validateBool({ update });

  return {
    ci,
    excludes,
    includes,
    precommit,
    strict,
    update
  };
}

function createWatchConfig(options: BettererOptionsWatch): BettererConfigWatch {
  const ignores = toArray<string>(options.ignores);
  const watch = options.watch || false;

  validateStringArray({ ignores });
  validateBool({ watch });

  return {
    ignores,
    watch
  };
}

function modeConfig(config: BettererConfig) {
  // CI mode:
  if (config.ci) {
    config.precommit = false;
    config.strict = true;
    config.update = false;
    config.watch = false;
    return;
  }
  // Precommit mode:
  if (config.precommit) {
    config.ci = false;
    config.strict = true;
    config.update = false;
    config.watch = false;
    return;
  }
  // Strict mode:
  if (config.strict) {
    config.ci = false;
    config.precommit = false;
    config.update = false;
    config.watch = false;
    return;
  }
  // Update mode:
  if (config.update) {
    config.ci = false;
    config.precommit = false;
    config.strict = false;
    config.watch = false;
    return;
  }
  // Watch mode:
  if (config.watch) {
    config.ci = false;
    config.precommit = false;
    config.strict = true;
    config.update = false;
    return;
  }
}

function validateBool<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isBoolean(value), `"${propertyName.toString()}" must be \`true\` or \`false\`. ${recieved(value)}`);
}

function validateNumber<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isNumber(value), `"${propertyName.toString()}" must be a number. ${recieved(value)}`);
}

function validateString<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isString(value), `"${propertyName.toString()}" must be a string. ${recieved(value)}`);
}

function validateStringOrArray<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(
    isString(value) || Array.isArray(value),
    `"${propertyName.toString()}" must be a string or an array. ${recieved(value)}`
  );
}

function validateStringArray<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validateStringOrArray(config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item)),
    `"${propertyName.toString()}" must be an array of strings. ${recieved(value)}`
  );
}

function validateStringRegExpArray<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validateStringOrArray(config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item) || isRegExp(item)),
    `"${propertyName.toString()}" must be an array of strings or RegExps. ${recieved(value)}`
  );
}

function validateConfigPaths(cwd: string, configPaths: Array<string>): Array<string> {
  return configPaths.map((configPath) => {
    const absoluteConfigPath = path.resolve(cwd, configPath);
    try {
      return require.resolve(absoluteConfigPath);
    } catch (error) {
      throw new BettererError(`could not find config file at "${absoluteConfigPath}". 😔`, error as Error);
    }
  });
}

async function validateFilePath<Config, PropertyName extends keyof Config>(config: Config): Promise<void> {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(
    value == null || (isString(value) && (await read(value)) !== null),
    `"${propertyName.toString()}" must be a path to a file. ${recieved(value)}`
  );
}

function validateWorkers(options: BettererOptionsBase = {}): number {
  if (options.workers === true || isUndefined(options.workers)) {
    options.workers = TOTAL_CPUS >= 4 ? TOTAL_CPUS - 2 : false;
  }
  if (options.workers === false || options.workers === 0) {
    process.env.WORKER_REQUIRE = 'false';
    // When disabled, set workers to 1 so that BettererRunWorkerPoolΩ
    // can be instantiated correctly:
    options.workers = 1;
  }

  const { workers } = options;

  validateNumber({ workers });
  validate(
    isNumber(workers) && workers > 0 && workers <= TOTAL_CPUS,
    `"workers" must be more than zero and not more than the number of available CPUs (${TOTAL_CPUS}). To disable workers, set to \`false\`. ${recieved(
      workers
    )}`
  );
  return workers;
}

function validate(value: unknown, message: string): asserts value is boolean {
  // Wrap the AssertionError in a BettererError for logging:
  try {
    assert(value);
  } catch {
    throw new BettererError(message);
  }
}

function recieved(value: unknown): string {
  return `Recieved \`${JSON.stringify(value)}\`.`;
}

function toArray<T>(value?: ReadonlyArray<T> | Array<T> | T): Array<T> {
  return Array.isArray(value) ? value : isUndefined(value) ? [] : [value as T];
}

function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
