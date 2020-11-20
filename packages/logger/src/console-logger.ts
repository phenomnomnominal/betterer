import chalk from 'chalk';

import { codeΔ } from './code';
import { BettererLogMessage, BettererLogger, BettererLoggerCodeInfo, BettererLoggerMessages } from './types';

const ERROR_BLOCK = chalk.bgRed('  ');
const NEW_LINE = '\n';

const HEADING = chalk.bgBlack.yellowBright.bold(` ☀️  betterer `);

export class BettererConsoleLogger implements BettererLogger {
  public debug: BettererLogMessage;
  public error: BettererLogMessage;
  public info: BettererLogMessage;
  public success: BettererLogMessage;
  public warn: BettererLogMessage;

  constructor() {
    this.debug = this._createLogger(chalk.bgBlueBright.black(' debg '), chalk.bgBlack(' 🤔 '));
    this.error = this._createLogger(chalk.bgRedBright.white(' erro '), chalk.bgBlack(' 🔥 '));
    this.info = this._createLogger(chalk.bgWhiteBright.black(' info '), chalk.bgBlack(' 💬 '));
    this.success = this._createLogger(chalk.bgGreenBright.black(' succ '), chalk.bgBlack(' ✅ '));
    this.warn = this._createLogger(chalk.bgYellowBright.black(' warn '), chalk.bgBlack(' 🚨 '));
  }

  public code(codeInfo: BettererLoggerCodeInfo): void {
    const { message } = codeInfo;
    const codeFrame = codeΔ(codeInfo);
    const codeMessage = chalk.bgBlack.white(message.trim());
    this._log(`${NEW_LINE}${ERROR_BLOCK} ${codeMessage.split(NEW_LINE).join(`\n${ERROR_BLOCK} `)}\n\n${codeFrame}`);
  }

  private _log(...args: Array<string>): void {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  private _createLogger(name: string, icon: string): BettererLogMessage {
    const SPACER = chalk.bgBlack.yellowBright(' - ');
    return (...messages: BettererLoggerMessages): void => {
      this._log(`${HEADING}${name}${icon}${SPACER}`, ...messages.map((m) => chalk.whiteBright(m)));
    };
  }
}
