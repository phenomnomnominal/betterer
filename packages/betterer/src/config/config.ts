import { BettererError } from '@betterer/errors';
import { muteΔ, unmuteΔ } from '@betterer/logger';
import assert from 'assert';
import { promises as fs } from 'fs';
import * as path from 'path';

import { isBoolean, isRegExp, isString, isUndefined } from '../utils';
import { BettererConfig, BettererConfigPartial } from './types';

let globalConfig: BettererConfig | null = null;

export async function createConfig(partialConfig: BettererConfigPartial = {}): Promise<BettererConfig> {
  const relativeConfig = {
    allowDiff: partialConfig.allowDiff ?? true,
    configPaths: partialConfig.configPaths ? toArray<string>(partialConfig.configPaths) : ['./.betterer'],
    cwd: partialConfig.cwd || process.cwd(),
    filters: toRegExps(toArray<string | RegExp>(partialConfig.filters)),
    ignores: toArray<string>(partialConfig.ignores),
    reporters: toArray<string>(partialConfig.reporters),
    resultsPath: partialConfig.resultsPath || './.betterer.results',
    silent: partialConfig.silent || false,
    tsconfigPath: partialConfig.tsconfigPath || null,
    update: partialConfig.update || false
  };

  relativeConfig.silent ? muteΔ() : unmuteΔ();

  validateConfig(relativeConfig);

  globalConfig = {
    ...relativeConfig,
    configPaths: relativeConfig.configPaths.map((configPath) => path.resolve(relativeConfig.cwd, configPath)),
    resultsPath: path.resolve(relativeConfig.cwd, relativeConfig.resultsPath),
    tsconfigPath: relativeConfig.tsconfigPath ? path.resolve(relativeConfig.cwd, relativeConfig.tsconfigPath) : null
  };

  const config = getConfig();
  await validateFilePath('tsconfigPath', config.tsconfigPath);
  return config;
}

export function getConfig(): BettererConfig {
  assert(globalConfig);
  return globalConfig;
}

function validateConfig(config: BettererConfig): void {
  validateBool('allowDiff', config.allowDiff);
  validateBool('silent', config.silent);
  validateBool('update', config.update);
  validateString('cwd', config.cwd);
  validateString('resultsPath', config.resultsPath);
  validateStringArray('configPaths', config.configPaths);
  validateStringArray('ignores', config.ignores);
  validateStringArray('reporters', config.reporters);
  validateStringRegExpArray('filters', config.filters);
}

function validateBool<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): void {
  validate(isBoolean(value), `"${propertyName}" must be \`true\` or \`false\`. ${recieved(value)}`);
}

function validateString<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): void {
  validate(isString(value), `"${propertyName}" must be a string. ${recieved(value)}`);
}

function validateStringOrArray<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): void {
  validate(
    isString(value) || Array.isArray(value),
    `"${propertyName}" must be a string or an array. ${recieved(value)}`
  );
}

function validateStringArray<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): void {
  validateStringOrArray(propertyName, value);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item)),
    `"${propertyName}" must be an array of strings. ${recieved(value)}`
  );
}

function validateStringRegExpArray<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): void {
  validateStringOrArray(propertyName, value);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item) || isRegExp(item)),
    `"${propertyName}" must be an array of strings or RegExps. ${recieved(value)}`
  );
}

async function validateFilePath<PropertyName extends keyof BettererConfig>(
  propertyName: PropertyName,
  value: BettererConfig[PropertyName]
): Promise<void> {
  validate(
    value == null || (isString(value) && (await fs.readFile(value))),
    `"${propertyName}" must be a path to a file. ${recieved(value)}`
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
