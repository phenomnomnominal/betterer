import { codeFrameColumns } from '@babel/code-frame';
import * as chalk from 'chalk';
import logDiff, { DiffOptions } from 'jest-diff';
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

export function muteΔ(): void {
  muted = true;
}

export function unmuteΔ(): void {
  muted = false;
}

export function logoΔ(): void {
  log(LOGO);
}

export function brΔ(): void {
  log('');
}

const HEADING = chalk.bgBlack.yellowBright.bold(` ☀️  betterer `);

let previousLogger: 'LOG' | 'CODE' = 'LOG';

export const debugΔ = createLogger(chalk.bgBlue.white(' debg '), chalk.bgBlack(' 🤔 '));
export const successΔ = createLogger(chalk.bgGreenBright.black(' succ '), chalk.bgBlack(' ✅ '));
export const infoΔ = createLogger(chalk.bgWhiteBright.black(' info '), chalk.bgBlack(' 💬 '));
export const warnΔ = createLogger(chalk.bgYellowBright.black(' warn '), chalk.bgBlack(' 🚨 '));
export const errorΔ = createLogger(chalk.bgRedBright.white(' erro '), chalk.bgBlack(' 🔥 '));

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
      brΔ();
    }
    log(`${HEADING}${name}${icon}${SPACER}`, ...messages.map((m) => chalk.whiteBright(m)));
    previousLogger = 'LOG';
  };
}

export function codeΔ(codeInfo: BettererLoggerCodeInfo): void {
  const { filePath, fileText, message } = codeInfo;
  const isJS = IS_JS_REGEXP.exec(path.extname(filePath));
  const options = {
    highlightCode: !!isJS
  };
  const lc = new LinesAndColumns(fileText);
  const startLocation = codeInfo;
  const startIndex = lc.indexForLocation(startLocation) || 0;
  const endLocation = lc.locationForIndex(startIndex + codeInfo.length) || startLocation;
  const start = {
    line: startLocation.line + 1,
    column: startLocation.column + 1
  };
  const end = {
    line: endLocation.line + 1,
    column: endLocation.column + 1
  };
  const codeFrame = codeFrameColumns(fileText, { start, end }, options);
  const codeMessage = chalk.bgBlack.white(message.trim());
  log(`${NEW_LINE}${ERROR_BLOCK} ${codeMessage.split(NEW_LINE).join(`\n${ERROR_BLOCK} `)}\n\n${codeFrame}`);
  previousLogger = 'CODE';
}

export function overwriteΔ(content: string): BettererLoggerOverwriteDone {
  if (!muted) {
    logUpdate(`${LOGO}${NEW_LINE}${content}`);
  }
  return logUpdate.done.bind(logUpdate);
}

const DEFAULT_DIFF_OPTIONS: DiffOptions = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

export function diffΔ(expected: unknown, result: unknown, options: DiffOptions = DEFAULT_DIFF_OPTIONS): void {
  // eslint-disable-next-line no-console
  console.log(logDiff(expected, result, options));
}
