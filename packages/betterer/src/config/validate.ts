import assert from 'node:assert';
import os from 'node:os';

import { BettererError } from '@betterer/errors';

import { read } from '../fs/index.js';
import { isBoolean, isNumber, isRegExp, isString, isUndefined } from '../utils.js';

export function validateBool<Config extends object, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isBoolean(value), `"${propertyName.toString()}" must be \`true\` or \`false\`. ${received(value)}`);
}

export function validateString<Config extends object, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isString(value), `"${propertyName.toString()}" must be a string. ${received(value)}`);
}

export async function validateFilePath<Config extends object, PropertyName extends keyof Config>(
  config: Config
): Promise<void> {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(
    value == null || (isString(value) && (await read(value)) !== null),
    `"${propertyName.toString()}" must be a path to a file. ${received(value)}`
  );
}

function validateNumber<Config extends object, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(isNumber(value), `"${propertyName.toString()}" must be a number. ${received(value)}`);
}

export function validateStringArray<Config extends object, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validateStringOrArray(config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item)),
    `"${propertyName.toString()}" must be an array of strings. ${received(value)}`
  );
}

function validateStringOrArray<Config extends object, PropertyName extends keyof Config>(config: Config): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validate(
    isString(value) || Array.isArray(value),
    `"${propertyName.toString()}" must be a string or an array. ${received(value)}`
  );
}

export function validateStringRegExpArray<Config extends object, PropertyName extends keyof Config>(
  config: Config
): void {
  const [propertyName] = Object.keys(config);
  const value = config[propertyName as PropertyName];
  validateStringOrArray(config);
  validate(
    !Array.isArray(value) || value.every((item) => isString(item) || isRegExp(item)),
    `"${propertyName.toString()}" must be an array of strings or RegExps. ${received(value)}`
  );
}

export function validateWorkers(workers: number | boolean = true): number {
  const totalCPUs = os.cpus().length;

  if (workers === true || isUndefined(workers)) {
    workers = totalCPUs >= 4 ? totalCPUs - 2 : false;
  }
  if (workers === false || workers === 0) {
    process.env.BETTERER_WORKER = 'false';
    // When disabled, set workers to 1 so that the BettererWorkerPool
    // can be instantiated correctly:
    workers = 1;
  }

  validateNumber({ workers });
  validate(
    isNumber(workers) && workers > 0 && workers <= totalCPUs,
    `"workers" must be more than zero and not more than the number of available CPUs (${totalCPUs}). To disable workers, set to \`false\`. ${received(
      workers
    )}`
  );
  return workers;
}

export function validate(value: unknown, message: string): asserts value is boolean {
  // Wrap the AssertionError in a BettererError for logging:
  try {
    assert(value);
  } catch {
    throw new BettererError(message);
  }
}

function received(value: unknown): string {
  return `Received \`${JSON.stringify(value)}\`.`;
}
