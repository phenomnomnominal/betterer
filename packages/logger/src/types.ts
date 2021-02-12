export type BettererLoggerMessages = Array<string>;
export type BettererLogMessage = (...messages: BettererLoggerMessages) => void;
export type BettererLogMessageAsync = (...messages: BettererLoggerMessages) => Promise<void>;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};

export type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => void;
export type BettererLogCodeAsync = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

export type BettererLogger = {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  progress: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
};

export type BettererLoggerAsync = {
  code: BettererLogCodeAsync;
  debug: BettererLogMessageAsync;
  error: BettererLogMessageAsync;
  info: BettererLogMessageAsync;
  progress: BettererLogMessageAsync;
  success: BettererLogMessageAsync;
  warn: BettererLogMessageAsync;
};
