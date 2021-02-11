export type BettererLoggerMessages = Array<string>;
export type BettererLogMessage = (...messages: BettererLoggerMessages) => Promise<void>;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};

export type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

export type BettererLogger = {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
};
