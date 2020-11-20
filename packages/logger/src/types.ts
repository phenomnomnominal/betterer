export type BettererLoggerMessages = ReadonlyArray<string>;
export type BettererLogMessage = (...messages: BettererLoggerMessages) => void;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};

export type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => void;

export type BettererLogger = {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
};
