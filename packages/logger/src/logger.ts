import { codeFrameColumns } from '@babel/code-frame';
import LinesAndColumns from 'lines-and-columns';
import { addLevel, enableColor, enableUnicode, log, StyleObject } from 'npmlog';
import * as path from 'path';

const IS_JS_REGEXP = /.t|jsx?$/;

// HACK:
// Need to import npmlog as a module to override global settings.
import * as npmlog from 'npmlog';

assign(npmlog, 'heading', '☀️  betterer');
assign(npmlog, 'headingStyle', {
  fg: 'yellow'
});

enableColor();
enableUnicode();

export function mute(): void {
  assign(npmlog, 'level', 'silent');
  // HACK:
  // There seems to be an issue with this lint rule for *assigning*.
  // Should file an issue...
  // eslint-disable-next-line @typescript-eslint/unbound-method
  console.log = (): void => {};
}

const SUCCESS_LEVEL = 2500;
const SUCCESS_STYLE: StyleObject = {
  bg: 'green',
  fg: 'black'
};
export const success = createLogger('good ❤️ ', SUCCESS_LEVEL, SUCCESS_STYLE);

const INFO_LEVEL = 2000;
const INFO_STYLE: StyleObject = {
  bg: 'black',
  fg: 'white'
};
export const info = createLogger('info 💬 ', INFO_LEVEL, INFO_STYLE);

const WARN_LEVEL = 3000;
const WARN_STYLE: StyleObject = {
  bg: 'yellow',
  fg: 'black'
};
export const warn = createLogger('warn ⚠️ ', WARN_LEVEL, WARN_STYLE);

const ERROR_LEVEL = 4000;
const ERROR_STYLE: StyleObject = {
  bg: 'red',
  fg: 'white'
};
export const error = createLogger('baad 💀 ', ERROR_LEVEL, ERROR_STYLE);

function createLogger(
  name: string,
  level: number,
  style: StyleObject
): (...args: Array<string>) => void {
  const loggerName = `betterer-${name}`;
  addLevel(loggerName, level, style, ` ${name} `);
  return function(message: string, ...args: Array<string>): void {
    log(loggerName, '-', message, ...args);
  };
}

export const code = function(codeInfo: LoggerCodeInfo): void {
  const { filePath, fileText } = codeInfo;
  const isJS = IS_JS_REGEXP.exec(path.extname(filePath));
  const options = {
    highlightCode: !!isJS
  };
  const lc = new LinesAndColumns(fileText);
  const startLocation = lc.locationForIndex(codeInfo.start);
  const endLocation = lc.locationForIndex(codeInfo.end);
  const start = {
    line: startLocation ? startLocation.line + 1 : 0,
    column: startLocation ? startLocation.column + 1 : 0
  };
  const end = {
    line: endLocation ? endLocation.line + 1 : 0,
    column: endLocation ? endLocation.column + 1 : 0
  };

  console.log(`${codeFrameColumns(fileText, { start, end }, options)}\n`);
};

export type LoggerCodeInfo = {
  filePath: string;
  fileText: string;
  start: number;
  end: number;
};

export type LoggerCodeLocation = {
  line: number;
  column: number;
};

function assign<T, K extends keyof T>(
  object: T,
  property: K,
  value: T[K]
): void {
  object[property] = value;
}
