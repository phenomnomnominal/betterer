export type BettererLoggerMessage = string;
export type BettererLoggerMessages = Array<BettererLoggerMessage>;
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
