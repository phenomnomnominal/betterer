import { codeFrameColumns } from '@babel/code-frame';
import chalk from 'chalk';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';

const IS_JS_REGEXP = /.t|jsx?$/;

export function mute(): void {
  console['log'] = (): void => {};
}

export function header(head: string): void {
  console.log(chalk.yellowBright(head));
}

export function logo(): void {
  header(`
   \\ | /     _          _   _                     
 '-.ooo.-'  | |__   ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\ / _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_) |  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/ \\___|\\__|\\__\\___|_|  \\___|_|   
 `);
}

export function br(): void {
  console.log('');
}

const HEADING = chalk.bgBlack.yellowBright.bold(` ☀️  betterer `);

let previousLogger: 'LOG' | 'CODE' = 'LOG';

export const success = createLogger(chalk.bgGreenBright.black(' succ '), chalk.bgBlack(' ✅ '));
export const info = createLogger(chalk.bgWhiteBright.black(' info '), chalk.bgBlack(' 💬 '));
export const warn = createLogger(chalk.bgYellowBright.black(' warn '), chalk.bgBlack(' ⚠️ '));
export const error = createLogger(chalk.bgRedBright.white(' erro '), chalk.bgBlack(' 🔥 '));

const SPACER = chalk.bgBlack.yellowBright(' - ');

function createLogger(name: string, icon: string): (...args: Array<string>) => void {
  return function(...messages: Array<string>): void {
    if (previousLogger === 'CODE') {
      br();
    }
    console.log(`${HEADING}${name}${icon}${SPACER}`, ...messages.map(m => chalk.whiteBright(m)));
    previousLogger = 'LOG';
  };
}

export const code = function(codeInfo: LoggerCodeInfo): void {
  const { filePath, fileText, message } = codeInfo;
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

  const codeFrame = codeFrameColumns(fileText, { start, end }, options);
  console.log(`\n${chalk.bgRed('  ')}${chalk.bgBlack.white(` ${message} \n`)}${codeFrame}`);
  previousLogger = 'CODE';
};

export type LoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  start: number;
  end: number;
};

export type LoggerCodeLocation = {
  line: number;
  column: number;
};
