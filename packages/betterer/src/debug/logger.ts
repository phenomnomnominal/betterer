import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';

import { BettererDebugLogger, BettererDebugOptions } from './types';

export class BettererDebugLoggerΩ {
  private _depth = 0;
  private _logger: BettererDebugLogger;
  private _time: boolean;
  private _values: boolean;

  constructor(options: Partial<BettererDebugOptions>) {
    this._time = options.time || false;
    this._values = options.values || false;
    this._logger = options.logger || this._getLogger(options.logPath);
  }

  public raw(logString: string): void {
    this._logger(logString);
  }

  public start(name: string, args: Array<unknown>): void {
    this._depth += 1;
    let debugString = this._printDepth(name);
    if (this._values) {
      debugString += ` args: ${this._printObject(args)}`;
    }
    this._logger(debugString);
  }

  public end(name: string, startTime: number, endTime: number, result: unknown): void {
    let debugString = this._printDepth(name);
    if (this._time) {
      debugString += ` time: ${endTime - startTime}ms`;
    }
    if (this._values) {
      debugString += ` return: ${this._printObject(result)}`;
    }
    this._logger(debugString);
    this._depth -= 1;
  }

  private _getLogger(relativeLogPath?: string): BettererDebugLogger {
    if (relativeLogPath) {
      const absoluteLogPath = path.resolve(process.cwd(), relativeLogPath);
      return function (logString: string): void {
        fs.appendFileSync(absoluteLogPath, logString);
      };
    } else {
      return function (logString: string): void {
        process.stdout.write(logString);
      };
    }
  }

  private _printDepth(name: string): string {
    return `${'▸'.repeat(this._depth)} ${name}`;
  }

  private _printObject(object: unknown): string {
    return inspect(object, { getters: true, depth: Infinity }).replace(/\n/g, '');
  }
}
