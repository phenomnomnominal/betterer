/**
 * @public a message to be logged.
 */
export type BettererLoggerMessage = string;

/**
 * @public an array of {@link BettererLoggerMessage | `BettererLoggerMessage`s} to be logged.
 */
export type BettererLoggerMessages = Array<BettererLoggerMessage>;

/**
 * @public a function that takes an array of {@link BettererLoggerMessage | `BettererLoggerMessage`s }
 * and logs them asynchronously.
 */
export type BettererLogMessage = (...messages: BettererLoggerMessages) => Promise<void>;

/**
 * @public the information required to log a code block with a message.
 */
export interface BettererLoggerCodeInfo {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
}

/**
 * @public a function that takes a {@link BettererLoggerCodeInfo | `BettererLoggerCodeInfo` }
 * and logs it asynchronously.
 */
export type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

/**
 * @public the logger interface for **Betterer** reporter and task logging.
 */
export interface BettererLogger {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  progress: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * A logging instruction which can be logged at a later time using {@link @betterer/logger#log__ | `log__()`}.
 */
export interface BettererLog {
  code?: BettererLoggerCodeInfo;
  debug?: BettererLoggerMessage;
  error?: BettererLoggerMessage;
  info?: BettererLoggerMessage;
  progress?: BettererLoggerMessage;
  success?: BettererLoggerMessage;
  warn?: BettererLoggerMessage;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * A set of logging instructions which can be logged at a later time using {@link @betterer/logger#log__ | `log__()`}.
 */
export type BettererLogs = Array<BettererLog>;
