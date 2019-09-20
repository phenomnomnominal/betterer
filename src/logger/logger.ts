import { addLevel, enableColor, enableUnicode, log, StyleObject } from 'npmlog';

// HACK:
// Need to import npmlog as a module to override global settings.
import * as npmlog from 'npmlog';

// HACK:
// This assertion is necessary to overwriting "readonly".
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
(npmlog.heading as string) = '☀️  better';
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
(npmlog.headingStyle as StyleObject) = {
  bg: 'black',
  fg: 'yellow'
};

enableColor();
enableUnicode();

export function mute(): void {
  // HACK:
  // This assertion is necessary to overwriting "readonly".
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  (npmlog.level as string) = 'silent';
}

const SUCCESS_LEVEL = 2500;
const SUCCESS_STYLE: StyleObject = {
  fg: 'green'
};
export const success = createLogger('success', SUCCESS_LEVEL, SUCCESS_STYLE);

const INFO_LEVEL = 2000;
const INFO_STYLE: StyleObject = {
  fg: 'white'
};
export const info = createLogger('info', INFO_LEVEL, INFO_STYLE);

const WARN_LEVEL = 3000;
const WARN_STYLE: StyleObject = {
  fg: 'yellow'
};
export const warn = createLogger('warn', WARN_LEVEL, WARN_STYLE);

const ERROR_LEVEL = 4000;
const ERROR_STYLE: StyleObject = {
  fg: 'red'
};
export const error = createLogger('error', ERROR_LEVEL, ERROR_STYLE);

function createLogger(
  name: string,
  level: number,
  style: StyleObject
): (...args: Array<string>) => void {
  const loggerName = `better-${name}`;
  addLevel(loggerName, level, style, name);
  return function(message: string, ...args: Array<string>): void {
    log(loggerName, '', message, ...args);
  };
}
