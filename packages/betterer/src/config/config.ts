import { BettererError } from '@betterer/errors';
import assert from 'assert';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';

import { BettererFileResolverΩ, BettererVersionControlWorker } from '../fs';
import { isBoolean, isNumber, isRegExp, isString, isUndefined } from '../utils';
import {
  BettererConfig,
  BettererConfigReporter,
  BettererOptionsBase,
  BettererOptionsRunner,
  BettererOptionsStart,
  BettererOptionsWatch
} from './types';

const TOTAL_CPUS = os.cpus().length;

export async function createConfig(
  options: unknown = {},
  versionControl: BettererVersionControlWorker
): Promise<BettererConfig> {
  const baseOptions = options as BettererOptionsBase;
  const runnerOptions = options as BettererOptionsRunner;
  const startOptions = options as BettererOptionsStart;
  const watchOptions = options as BettererOptionsWatch;

  const isDebug = !!process.env.BETTERER_DEBUG;

  const relativeConfig: BettererConfig = {
    // Base:
    cache: baseOptions.cache || false,
    cachePath: baseOptions.cachePath || './.betterer.cache',
    configPaths: baseOptions.configPaths ? toArray<string>(baseOptions.configPaths) : ['./.betterer'],
    cwd: baseOptions.cwd || process.cwd(),
    filters: toRegExps(toArray<string | RegExp>(baseOptions.filters)),
    reporters: toArray<BettererConfigReporter>(baseOptions.reporters),
    resultsPath: baseOptions.resultsPath || './.betterer.results',
    silent: isDebug || baseOptions.silent || false,
    tsconfigPath: baseOptions.tsconfigPath || null,
    workers: baseOptions.workers || Math.max(TOTAL_CPUS - 2, 1),

    // Runner:
    ignores: toArray<string>(runnerOptions.ignores),

    // Start:
    ci: startOptions.ci || false,
    filePaths: [],
    precommit: startOptions.precommit || false,
    strict: startOptions.strict || false,
    update: startOptions.update || false,

    // Watch
    watch: watchOptions.watch || false
  };

  validateConfig(relativeConfig);
  overrideConfig(relativeConfig);

  const { includes, excludes } = startOptions;

  const resolver = new BettererFileResolverΩ(relativeConfig.cwd, versionControl);
  resolver.include(...toArray<string>(includes));
  resolver.exclude(...toRegExps(toArray<string | RegExp>(excludes)));

  const config = {
    ...relativeConfig,
    cachePath: path.resolve(relativeConfig.cwd, relativeConfig.cachePath),
    filePaths: await resolver.files(),
    configPaths: relativeConfig.configPaths.map((configPath) => path.resolve(relativeConfig.cwd, configPath)),
    resultsPath: path.resolve(relativeConfig.cwd, relativeConfig.resultsPath),
    tsconfigPath: relativeConfig.tsconfigPath ? path.resolve(relativeConfig.cwd, relativeConfig.tsconfigPath) : null
  };

  if (config.tsconfigPath) {
    await validateFilePath('tsconfigPath', config);
  }

  return config;
}

function validateConfig(config: BettererConfig): void {
  // Base:
  validateBool('cache', config);
  validateString('cachePath', config);
  validateStringArray('configPaths', config);
  validateString('cwd', config);
  validateStringRegExpArray('filters', config);
  validateString('resultsPath', config);
  validateBool('silent', config);
  validateWorkers('workers', config);

  // Start:
  validateBool('ci', config);
  validateBool('precommit', config);
  validateBool('strict', config);
  validateBool('update', config);

  // Runner:
  validateStringArray('ignores', config);

  // Watch:
  validateBool('watch', config);
}

function overrideConfig(config: BettererConfig) {
  // Silent mode:
  if (config.silent) {
    config.reporters = [];
  }

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

function validateBool<Config, PropertyName extends keyof Config>(propertyName: PropertyName, config: Config): void {
  const value = config[propertyName];
  validate(isBoolean(value), `"${propertyName.toString()}" must be \`true\` or \`false\`. ${recieved(value)}`);
}

function validateNumber<Config, PropertyName extends keyof Config>(propertyName: PropertyName, config: Config): void {
  const value = config[propertyName];
  validate(isNumber(value), `"${propertyName.toString()}" must be a number. ${recieved(value)}`);
}

function validateString<Config, PropertyName extends keyof Config>(propertyName: PropertyName, config: Config): void {
  const value = config[propertyName];
  validate(isString(value), `"${propertyName.toString()}" must be a string. ${recieved(value)}`);
}

function validateStringOrArray<Config, PropertyName extends keyof Config>(
  propertyName: PropertyName,
  config: Config
): void {
  const value = config[propertyName];
  validate(
    isString(value) || Array.isArray(value),
    `"${propertyName.toString()}" must be a string or an array. ${recieved(value)}`
  );
}

function validateStringArray<Config, PropertyName extends keyof Config>(
  propertyName: PropertyName,
  config: Config
): void {
  const value = config[propertyName];
  validateStringOrArray(propertyName, config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item)),
    `"${propertyName.toString()}" must be an array of strings. ${recieved(value)}`
  );
}

function validateStringRegExpArray<Config, PropertyName extends keyof Config>(
  propertyName: PropertyName,
  config: Config
): void {
  const value = config[propertyName];
  validateStringOrArray(propertyName, config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item) || isRegExp(item)),
    `"${propertyName.toString()}" must be an array of strings or RegExps. ${recieved(value)}`
  );
}

async function validateFilePath<Config, PropertyName extends keyof Config>(
  propertyName: PropertyName,
  config: Config
): Promise<void> {
  const value = config[propertyName];
  validate(
    value == null || (isString(value) && (await fs.readFile(value))),
    `"${propertyName.toString()}" must be a path to a file. ${recieved(value)}`
  );
}

function validateWorkers<Config, PropertyName extends keyof Config>(propertyName: PropertyName, config: Config): void {
  const value = config[propertyName];
  validateNumber(propertyName, config);
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
