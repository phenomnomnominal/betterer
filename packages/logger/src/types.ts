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
export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};

/**
 * @public a function that takes a {@link BettererLoggerCodeInfo | `BettererLoggerCodeInfo` }
 * and logs it asynchronously.
 */
export type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

/**
 * @public The logging interface for **Betterer** reporter and task logging.
 */
export type BettererLogger = {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  progress: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
};

export type BettererLog = {
  code?: BettererLoggerCodeInfo;
  debug?: BettererLoggerMessage;
  error?: BettererLoggerMessage;
  info?: BettererLoggerMessage;
  progress?: BettererLoggerMessage;
  success?: BettererLoggerMessage;
  warn?: BettererLoggerMessage;
};

export type BettererLogs = Array<BettererLog>;
