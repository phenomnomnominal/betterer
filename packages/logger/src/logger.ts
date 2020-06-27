import { codeFrameColumns } from '@babel/code-frame';
import * as chalk from 'chalk';
import * as logUpdate from 'log-update';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';

import { BettererLogger, BettererLoggerMessages, BettererLoggerCodeInfo, BettererLoggerOverwriteDone } from './types';

const ERROR_BLOCK = chalk.bgRed('  ');
const IS_JS_REGEXP = /.t|jsx?$/;
const LOGO = chalk.yellowBright(`
   \\ | /     _          _   _                     
 '-.ooo.-'  | |__   ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\ / _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_) |  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/ \\___|\\__|\\__\\___|_|  \\___|_|   
 `);
const NEW_LINE = '\n';

let muted = false;

export function mute(): void {
  muted = true;
}

export function unmute(): void {
  muted = false;
}

export function logo(): void {
  log(LOGO);
}

export function br(): void {
  log('');
}

const HEADING = chalk.bgBlack.yellowBright.bold(` ☀️  betterer `);

let previousLogger: 'LOG' | 'CODE' = 'LOG';

export const debug = createLogger(chalk.bgBlueBright.white(' debg '), chalk.bgBlack(' 🤔 '));
export const success = createLogger(chalk.bgGreenBright.black(' succ '), chalk.bgBlack(' ✅ '));
export const info = createLogger(chalk.bgWhiteBright.black(' info '), chalk.bgBlack(' 💬 '));
export const warn = createLogger(chalk.bgYellowBright.black(' warn '), chalk.bgBlack(' ⚠️ '));
export const error = createLogger(chalk.bgRedBright.white(' erro '), chalk.bgBlack(' 🔥 '));

const SPACER = chalk.bgBlack.yellowBright(' - ');

function log(...args: Array<string>): void {
  if (!muted) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

function createLogger(name: string, icon: string): BettererLogger {
  return function (...messages: BettererLoggerMessages): void {
    if (previousLogger === 'CODE') {
      br();
    }
    log(`${HEADING}${name}${icon}${SPACER}`, ...messages.map((m) => chalk.whiteBright(m)));
    previousLogger = 'LOG';
  };
}

export const code = function (codeInfo: BettererLoggerCodeInfo): void {
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
  const codeMessage = chalk.bgBlack.white(` ${message} ${NEW_LINE}`);
  log(`${NEW_LINE}${ERROR_BLOCK}${codeMessage}${codeFrame}`);
  previousLogger = 'CODE';
};

export function overwrite(content: string): BettererLoggerOverwriteDone {
  if (!muted) {
    logUpdate(`${LOGO}${NEW_LINE}${content}`);
  }
  return logUpdate.done.bind(logUpdate);
}
