import { BettererError } from '@betterer/errors';
import assert from 'assert';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';

import { BettererFileResolverΩ, BettererVersionControlWorker } from '../fs';
import { loadReporters, loadSilentReporter } from '../reporters';
import { isBoolean, isNumber, isRegExp, isString, isUndefined } from '../utils';
import {
  BettererConfig,
  BettererConfigBase,
  BettererConfigRunner,
  BettererConfigStart,
  BettererConfigWatch,
  BettererOptionsBase,
  BettererOptionsOverride,
  BettererOptionsReporter,
  BettererOptionsRunner,
  BettererOptionsStart,
  BettererOptionsWatch
} from './types';

const TOTAL_CPUS = os.cpus().length;

export async function createConfig(
  options: unknown = {},
  versionControl: BettererVersionControlWorker
): Promise<BettererConfig> {
  const baseConfig = createBaseConfig(options as BettererOptionsBase);
  const startConfig = await createStartConfig(options as BettererOptionsStart, baseConfig.cwd, versionControl);
  const runnerConfig = createRunnerConfig(options as BettererOptionsRunner);
  const watchConfig = createWatchConfig(options as BettererOptionsWatch);

  const config = { ...baseConfig, ...runnerConfig, ...startConfig, ...watchConfig };

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
    const reporters = toArray<BettererOptionsReporter>(optionsOverride.reporters);
    config.reporter = loadReporters(reporters, config.cwd);
  }
}

function createBaseConfig(options: BettererOptionsBase): BettererConfigBase {
  const isDebug = !!process.env.BETTERER_DEBUG;
  const cache = options.cache || false;
  const cachePath = options.cachePath || './.betterer.cache';
  const configPaths = options.configPaths ? toArray<string>(options.configPaths) : ['./.betterer'];
  const cwd = options.cwd || process.cwd();
  const filters = toRegExps(toArray<string | RegExp>(options.filters));
  const reporters = toArray<BettererOptionsReporter>(options.reporters);
  const silent = isDebug || options.silent || false;
  const reporter = silent ? loadSilentReporter() : loadReporters(reporters, cwd);
  const resultsPath = options.resultsPath || './.betterer.results';
  const tsconfigPath = options.tsconfigPath || null;
  const workers = options.workers || Math.max(TOTAL_CPUS - 2, 1);

  validateBool({ cache });
  validateString({ cachePath });
  validateStringArray({ configPaths });
  validateString({ cwd });
  validateStringRegExpArray({ filters });
  validateString({ resultsPath });
  validateBool({ silent });
  validateWorkers({ workers });

  return {
    cache,
    cachePath: path.resolve(cwd, cachePath),
    cwd,
    configPaths: configPaths.map((configPath) => path.resolve(cwd, configPath)),
    filters,
    reporter,
    resultsPath: path.resolve(cwd, resultsPath),
    tsconfigPath: tsconfigPath ? path.resolve(cwd, tsconfigPath) : null,
    workers
  };
}

function createRunnerConfig(options: BettererOptionsRunner): BettererConfigRunner {
  const ignores = toArray<string>(options.ignores);

  validateStringArray({ ignores });

  return {
    ignores
  };
}

async function createStartConfig(
  options: BettererOptionsStart,
  cwd: string,
  versionControl: BettererVersionControlWorker
): Promise<BettererConfigStart> {
  const ci = options.ci || false;
  const precommit = options.precommit || false;
  const strict = options.strict || false;
  const update = options.update || false;

  const includes = toArray<string>(options.includes) || [];
  const excludes = toRegExps(toArray<string | RegExp>(options.excludes)) || [];

  validateBool({ ci });
  validateBool({ precommit });
  validateBool({ strict });
  validateBool({ update });
  validateStringArray({ includes });
  validateStringRegExpArray({ excludes });

  const resolver = new BettererFileResolverΩ(cwd, versionControl);
  resolver.include(...includes);
  resolver.exclude(...excludes);

  return {
    ci,
    filePaths: await resolver.files(),
    precommit,
    strict,
    update
  };
}

function createWatchConfig(options: BettererOptionsWatch): BettererConfigWatch {
  const watch = options.watch || false;

  validateBool({ watch });

  return {
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

async function validateFilePath<Config, PropertyName extends keyof Config>(config: Config): Promise<void> {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(
    value == null || (isString(value) && (await fs.readFile(value))),
    `"${propertyName.toString()}" must be a path to a file. ${recieved(value)}`
  );
}

function validateWorkers<Config, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validateNumber(config);
  validate(
    isNumber(value) && value > 0 && value <= TOTAL_CPUS,
    `"${propertyName.toString()}" must be more than zero and not more than the number of available CPUs (${TOTAL_CPUS}). ${recieved(
      value
    )}`
  );
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
