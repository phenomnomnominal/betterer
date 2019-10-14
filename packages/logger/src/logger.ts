import { codeFrameColumns } from '@babel/code-frame';
import chalk from 'chalk';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';

const IS_JS_REGEXP = /.t|jsx?$/;

type ChainableNames<T> = {
  [K in keyof T]: T[K] extends T ? K : never;
}[keyof T];

type ChalkStyles = {
  bg: ChainableNames<typeof chalk>;
  fg: ChainableNames<typeof chalk>;
};

export function mute(): void {
  // HACK:
  // There seems to be an issue with this lint rule for *assigning*.
  // Should file an issue...
  // eslint-disable-next-line @typescript-eslint/unbound-method
  console.log = (): void => {};
}

const SUCCESS_STYLE: ChalkStyles = {
  bg: 'bgGreen',
  fg: 'black'
};
export const success = createLogger('❤️', SUCCESS_STYLE);

const INFO_STYLE: ChalkStyles = {
  bg: 'bgBlack',
  fg: 'white'
};
export const info = createLogger('💬', INFO_STYLE);

const WARN_STYLE: ChalkStyles = {
  bg: 'bgYellow',
  fg: 'black'
};
export const warn = createLogger('⚠️', WARN_STYLE);

const ERROR_STYLE: ChalkStyles = {
  bg: 'bgRed',
  fg: 'white'
};
export const error = createLogger('💀', ERROR_STYLE);

function createLogger(
  name: string,
  style: ChalkStyles
): (...args: Array<string>) => void {
  return function(...messages: Array<string>): void {
    console.log(
      chalk.bold.bgYellowBright('☀️ betterer'),
      chalk[style.fg][style.bg].bold(name),
      chalk.yellowBright.bold('-'),
      ...messages.map(m => chalk.whiteBright(m))
    );
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
