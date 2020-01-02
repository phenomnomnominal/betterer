import { error } from '@betterer/logger';
import chalk from 'chalk';

import { BettererError } from './error';

export type ErrorFactory = (...details: Array<unknown>) => BettererError;
export type ErrorMessageFactory = (...details: Array<unknown>) => string;

const ERROR_MESSAGES = new Map<symbol, ErrorMessageFactory>();

export function logError({ code, details }: BettererError): void {
  const factory = ERROR_MESSAGES.get(code);
  if (factory) {
    error(factory(...details));
  }
}

export function registerError(factory: ErrorMessageFactory): ErrorFactory {
  const code = Symbol();
  ERROR_MESSAGES.set(code, factory);
  return function(...details: Array<unknown>): BettererError {
    return new BettererError(code, details);
  };
}

export function errorValue(value: unknown): string {
  return chalk.redBright(`"${value}"`);
}
export function optionName(option: string): string {
  return chalk.blueBright(`\`${option}\``);
}
